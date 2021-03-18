# Figma Complex Themes
Figma plugin for styling and painting your layouts with different color themes.

Provides additional options for managing and editing styles in your layout, as well as a new method of organizing them for working with projects that are unified in different styles.

The plugin also allows you to work with theme schemas in json, with the ability to import and export them, which can also be convenient for developers to work with styles and their communication with designers. 

![sample](https://github.com/friktor/figma-complex-themes/blob/master/samples/sample.gif)

At the start you can try using this plugin from [sample figma mockup](https://github.com/friktor/figma-complex-themes/blob/master/samples/sample.fig)

# What does plugin do
- Styles
    - Themes
        - Create new theme
        - Duplicate existing theme 
        - Remove theme
        - Create theme with styles from selected layers (it groups same styles, and allows you to adapt existing mockups for subsequent adaptation to themes)
        - Styles group
            - Duplicate styles group
            - Remove styles group
    - Styles
        - Search styles
        - Rename style, move to another theme or group
        - Select all nodes with style (double click on style preview circle in list)
        - Edit style
            - Simple color picker for solid colors
            - Simple gradient picker for create gradient (unstable!)
- Redrawer
    - Nested redraw selected nodes with entries
    - Redraw one of selected nodes
    - Redraw all selected nodes
    - Redraw supported for 
        - Stroke paint styles
        - Fill paint styles
        - Text styles (but at the moment, only a named style template can be created in the plugin, you cannot change it in the plugin - use figma tools) 
- Library
    - Store your themes and apply it to new mockup
    - Download serialized json of theme (can be useful for example to give to the programmer necessary variables for all components) 

# How it works?
The core feature of this plugin is redrawer. It works based on style naming conventions: `GroupName[theme_name]/StyleName` or `Button[light]/Primary`

The core concept of this convention I'm took from [Appearance Plugin](https://github.com/glmrvn/Appearance-figma-plugin). 

But this approach is not native to figma, and therefore adding each such style manually - is rather annoying and time-consuming, so the plugin has its own style and theme editor to simplify the naming process and quickly insert the desired styles.

This is convenient because you can work with one target layout, and then simply duplicate the existing theme, and replace the necessary styles - so you can quickly create a new layout variation.

# Is it stable?
This is an alpha release, it implements the basic concept of working with themes, styles, redrawing. Most of them work stably, but this is not a polished version of the plugin, so in case of any errors and problems, the best option is either to restart the plugin or roll back certain changes in the layout using `Ctrl+Z`. 

At Now the plugin is at the stage of polishing, and this version is intended primarily for enthusiasts to check it in battle, and collect feedback (you can leave issues on github, or write to the mail) 

# Planned improvements
- Create detailed tutorial video
- Fix reaction bugs in ui side of plugin
- Adding some validators
- Adding simple text style editor
- Adding style guides generator
