<?php

function yz_empty_state(array $props): void {
    $id          = yz_prop($props, 'id');
    $class_name  = yz_prop($props, 'class');
    $title       = yz_prop($props, 'title');
    $description = yz_prop($props, 'description');
    $icon        = yz_prop($props, 'icon', yz_icon_svg(['glyph' => 'database', 'appearance' => 'duotone']));
    $actions     = yz_prop($props, 'actions', []);

    $class_names = [
        'yuzu',
        'empty-state'
    ];

    if ($class_name) {
        $class_names[] = $class_name;
    }

    yz_flex_layout([
        'id'            => $id,
        'class'         => trim(implode(' ', $class_names)),
        'gap'           => 20,
        'direction'     => 'column',
        'alignment'     => 'center',
        'justification' => 'center',
        'items' => [
            ['class' => 'empty-state-icon', 'children' => function() use ($icon) {
                echo $icon;
            }],
            ['children' => function() use ($title, $description, $actions) {
                yz_flex_layout([
                    'class'         => 'empty-state-content',
                    'direction'     => 'column',
                    'alignment'     => 'center',
                    'justification' => 'center',
                    'gap'           => 10,
                    'items'         => [
                        ['children' => function() use ($title) {
                            yz_title([
                                'id'       => 'empty-state-title',
                                'class'    => 'empty-state-title',
                                'level'    => 2,
                                'children' => function() use($title) {
                                    yz_text($title);
                                }
                            ]);
                        }],
                        ['children' => function() use ($description) {
                            yz_paragraph([
                                'class'    => 'empty-state-description',
                                'variant'  => 'description',
                                'children' => function() use($description) {
                                    yz_text($description);
                                }
                            ]);
                        }],
                        ['children' => function() use ($actions) {
                            yz_flex_layout([
                                'class'         => 'empty-state-actions',
                                'direction'     => 'row',
                                'alignment'     => 'center',
                                'justification' => 'center',
                                'gap'           => 20,
                                'items'         => array_map(function($action) {
                                    return [
                                        'children' => function() use ($action) {
                                            yz_button($action);
                                        }
                                    ];
                                }, $actions)
                            ]);
                        }]
                    ]
                ]);
            }]
        ]
    ]);
}