<?php

namespace Pterodactyl\Models;

class Billing extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'billing';

    /**
     * @var bool
     */
    public $timestamps = false;

    /**
     * @var array
     */
    protected $fillable = ['key', 'value'];

    /**
     * @var array
     */
    public static $validationRules = [
        'key' => 'required|string|between:1,191',
        'value' => 'string',
    ];
}
