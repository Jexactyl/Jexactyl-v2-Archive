<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCreditsToUsers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'cr_balance')) $table->integer('cr_balance');
            if (!Schema::hasColumn('users', 'cr_slots')) $table->integer('cr_slots');
            if (!Schema::hasColumn('users', 'cr_cpu')) $table->integer('cr_cpu');
            if (!Schema::hasColumn('users', 'cr_ram')) $table->integer('cr_ram');
            if (!Schema::hasColumn('users', 'cr_storage')) $table->integer('cr_storage');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('cr_balance');
            $table->dropColumn('cr_slots');
            $table->dropColumn('cr_cpu');
            $table->dropColumn('cr_ram');
            $table->dropColumn('cr_storage');
        });
    }
}
