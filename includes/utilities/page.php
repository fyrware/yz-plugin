<?php

/** @deprecated */
class Yz_Page {

    /** @deprecated */
    public static function add_menu_separator(float $position): void {
        global $menu;

        $separator = [
            0 => '',
            1 => 'read',
            2 => 'separator' . $position,
            3 => '',
            4 => 'wp-menu-separator'
        ];

        if (isset($menu[$position])) {
            $menu = array_splice($menu, $position, 0, $separator);
        } else {
            $menu[$position] = $separator;
        }
    }

    /** @deprecated */
    public static function add_page(array $page_settings, array &$action_queue = []): string {
        $parent     = Yz_Array::value_or($page_settings, 'parent');
        $title      = Yz_Array::value_or($page_settings, 'title');
        $capability = Yz_Array::value_or($page_settings, 'capability');
        $slug       = Yz_Array::value_or($page_settings, 'slug');
        $children   = Yz_Array::value_or($page_settings, 'children');
        $position   = Yz_Array::value_or($page_settings, 'position');
        $icon       = Yz_Array::value_or($page_settings, 'icon');

        $page = '';

        if (isset($icon) && str_starts_with($icon, '<svg')) {
            $icon = Yz_String::format_data_url('image/svg+xml', $icon);
        }

        if (isset($parent)) {
            $page = add_submenu_page(
                $parent,
                $title,
                $title,
                $capability,
                $slug,
                function() use($children, &$action_queue) { ?>
                    <script>
                        yz.wordpress.ajax = <?= json_encode(admin_url('admin-ajax.php')) ?>;
                        yz.wordpress.nonce = <?= json_encode(wp_create_nonce('yz')) ?>;
                    </script>
                    <section class="wrap">
                        <?php if (is_callable($children)) echo $children() ?>
                        <?php Yz::Portal(); ?>
                        <?php foreach ($action_queue as $action) do_action($action); ?>
                    </section>
                <?php },
                $position ?? null
            );
        } else {
            $page = add_menu_page(
                $title,
                $title,
                $capability,
                $slug,
                function() use($children, &$action_queue) { ?>
                    <script>
                        yz.wordpress.ajax = <?= json_encode(admin_url('admin-ajax.php')) ?>;
                        yz.wordpress.nonce = <?= json_encode(wp_create_nonce('yz')) ?>;
                    </script>
                    <section class="wrap">
                        <?php if (is_callable($children)) echo $children() ?>
                        <?php Yz::Portal(); ?>
                        <?php foreach ($action_queue as $action) do_action($action); ?>
                    </section>
                <?php },
                $icon,
                $position
            );
        }

        return $page;
    }
}