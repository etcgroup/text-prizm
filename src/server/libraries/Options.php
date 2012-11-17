<?php

defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * A collection of utility functions related to options-handling.
 */
class Options {

    /**
     * Copies missing values from the $defaults object to the $options object,
     * returning a new object. Both may be either arrays or objects.
     *
     * Modeled on http://underscorejs.org/#defaults
     *
     * @param mixed $options The provided options.
     * @param mixed $source The default values for the options.
     *
     * @return mixed
     */
    public function defaults($options, $defaults)
    {
        if (is_null($options))
        {
            $options = array();
        }

        $options_array = $options;

        //Convert options object to an array for uniform access
        if (is_object($options))
        {
            $options_array = (array) $options;
        }

        //Copy over any values from defalts that are not set in options
        foreach ($defaults as $key => $value)
        {
            if (!isset($options_array[$key]) || $options_array[$key] === NULL)
            {
                $options_array[$key] = $value;
            }
        }

        //Convert back to an object if necessary
        if (is_object($options))
        {
            return (object) $options_array;
        }
        else
        {
            return $options_array;
        }
    }

    /**
     * Checks if all of the provided keys exist in $options.
     *
     * $options may be either an array or an object.
     * Returns TRUE if all keys are present, and FALSE if not.
     *
     * @param mixed $options The options to search for keys.
     * @param array $keys An array of string references to keys.
     * @return boolean
     */
    public function has_keys($options, $keys)
    {
        if (is_null($options))
        {
            $options = array();
        }

        $options_array = $options;
        //Convert to array if necessary
        if (is_object($options))
        {
            $options_array = (array) $options;
        }

        foreach ($keys as $key)
        {
            if (!isset($options_array[$key]))
            {
                //The options does not contain this key
                return FALSE;
            }
        }

        //All of the keys were found
        return TRUE;
    }

    /**
     * Returns a new array/object containing only the allowed keys.
     *
     * @param mixed $options The options from which values will be drawn.
     * @param array $keys The allowed keys.
     */
    public function filter_keys($options, $keys)
    {
        if (is_null($options))
        {
            $options = array();
        }

        $options_array = $options;
        //Convert to array if necessary
        if (is_object($options))
        {
            $options_array = (array) $options;
        }

        //Pull only the specified keys out of options
        $result_array = array();
        foreach ($keys as $key)
        {
            if (array_key_exists($key, $options_array))
            {
                $result_array[$key] = $options_array[$key];
            }
        }

        //Convert back to object if necessary
        if (is_object($options))
        {
            return (object) $result_array;
        }
        else
        {
            return $result_array;
        }
    }

}
