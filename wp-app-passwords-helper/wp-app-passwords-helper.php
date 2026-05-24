<?php
/**
 * Plugin Name: WP App Passwords Helper
 * Description: Enables WordPress application passwords on local development sites.
 * Version: 1.0.0
 * Author: Copilot
 */

add_filter('wp_is_application_passwords_available', '__return_true');
add_filter('wp_is_application_passwords_available_for_user', '__return_true');
