<?php

namespace Pterodactyl\Models;

class Credits extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'credits';

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
