<?php

namespace Pterodactyl\Tests\Integration\Api\Client\Server\Backup;

use Mockery;
use Illuminate\Http\Response;
use Pterodactyl\Models\Backup;
use Pterodactyl\Models\Permission;
use Illuminate\Support\Facades\Event;
use Pterodactyl\Events\ActivityLogged;
use Pterodactyl\Repositories\Wings\DaemonBackupRepository;
use Pterodactyl\Tests\Integration\Api\Client\ClientApiIntegrationTestCase;

class DeleteBackupTest extends ClientApiIntegrationTestCase
{
    private $repository;

    public function setUp(): void
    {
        parent::setUp();

        $this->repository = $this->mock(DaemonBackupRepository::class);
    }

    public function testUserWithoutPermissionCannotDeleteBackup()
    {
        [$user, $server] = $this->generateTestAccount([Permission::ACTION_BACKUP_CREATE]);

        $backup = Backup::factory()->create(['server_id' => $server->id]);

        $this->actingAs($user)->deleteJson($this->link($backup))
            ->assertStatus(Response::HTTP_FORBIDDEN);
    }

    /**
     * Tests that a backup can be deleted for a server and that it is properly updated
     * in the database. Once deleted there should also be a corresponding record in the
     * activity logs table for this API call.
     */
    public function testBackupCanBeDeleted()
    {
        Event::fake([ActivityLogged::class]);

        [$user, $server] = $this->generateTestAccount([Permission::ACTION_BACKUP_DELETE]);

        /** @var \Pterodactyl\Models\Backup $backup */
        $backup = Backup::factory()->create(['server_id' => $server->id]);

        $this->repository->expects('setServer->delete')->with(
            Mockery::on(function ($value) use ($backup) {
                return $value instanceof Backup && $value->uuid === $backup->uuid;
            })
        )->andReturn(new Response());

        $this->actingAs($user)->deleteJson($this->link($backup))->assertStatus(Response::HTTP_NO_CONTENT);

        $backup->refresh();
        $this->assertSoftDeleted($backup);

        Event::assertDispatched(ActivityLogged::class, function (ActivityLogged $event) use ($backup, $user) {
            $this->assertTrue($event->isServerEvent());
            $this->assertTrue($event->is('server:backup.delete'));
            $this->assertTrue($user->is($event->actor()));
            $this->assertCount(2, $event->model->subjects);

            $subjects = $event->model->subjects;
            $this->assertCount(1, $subjects->filter(fn ($model) => $model->subject->is($backup)));
            $this->assertCount(1, $subjects->filter(fn ($model) => $model->subject->is($backup->server)));

            return true;
        });

        $this->actingAs($user)->deleteJson($this->link($backup))->assertStatus(Response::HTTP_NOT_FOUND);
    }
}
