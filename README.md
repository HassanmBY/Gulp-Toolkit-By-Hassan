# Gulp Base
My personnal base for gulp manager

---
## Project setup
In your terminal type:

```bash
npm install
```

### Start
Start the manager tasks:

```bash
gulp

```
### All tasks
Get all available tasks:

```bash
gulp --tasks
```
#### Run a specific task:

```bash
gulp taskName
```

---
## Features

#### SASS|SCSS
##### DEVMODE

File name: _devmode.scss

Path: src/style/partials/_devmode.scss

In the sass|scss partial named "_devmode" you can switch the value of `$MODE` (on line 1) between "dev" and "build". "Dev" mode applies a transparent color as the `background-color` of every element on the page. It can be helpful when integrating a page.

You can change the `background-color` used for dev mode by changing the value of the variable `$dev_color` on line 3.

### Additionnal infos
- Any js or scss file (that is not a library or partial) should be prefixed with prod_ or else it won't be compiled/minified
- The js and scss files prefixed with prod_ are minified and renamed to ~~prod_~~filename.min.(js|css) (/!\ Careful when linking files - This tip might save you some headaches)
- This file manager will use port 80 as a proxy and a folder called YOURPATH by default. In gulpfile.js you can change the port used, on line 12 and the folder name, on line 13. **Use a local web server solution stack package** (/!\ By defult, the file manager is proxying the dist folder in YOURPATH. You can change it on line 94 in gulpfile.js)

---
