# Build WordPress themes with Gulp

This is a boilerplate implementation of Gulp for WordPress. I've created it for personal use, but feel free to use it with your projects.

### What's inside?
- [Gulp 4](https://gulpjs.com/) - Task runner 
- [Sass](https://sass-lang.com/) - a CSS preprocessor
- [Rollup](https://rollupjs.org/guide/en/) - a JavaScript Modules Bundler
- [Babel (soon)](https://babeljs.io/) - JavaScript ES6 to ES5 compiler

### Installation
Clone or download the files and place it to root directory of the theme.
```
theme-name
|   package.json
|   gulpfile.babel.js
|
└───src
|   └───images
|   └───js
|   └───sass  
|
|   style.css
|   index.php
|   ... other php files
```
In `gulpfile.babel.js` file change proxy address
```javascript
export const serve = (done) => {
    server.init({
        // change this address depends on your local server
        proxy: 'http://localhost:8888/your-wordpress-theme/'
    });
    done();
};
```

### Development
Gulp is used to compile and optimize theme's scripts, stylesheets, and images.
Before being able to build theme you have to resolve required dependencies.

```bash
# @ wp-content/themes/<theme-name>

# Install node dependencies.
$ npm install
```
Now you have all the packages necessary to run the build process and start developing your theme.

There are two available commands:
```bash
# @ wp-content/themes/<theme-name>

# Development mode: compiles unminified and unoptimized theme assets with source maps.
# Init watch mode.
$ npm run start:dev

# Production build: compiles minified and optimized theme assets
$ npm run build
```

### Theme structure
After you run Gulp development mode it creates `/dest` directory with all compiled assets. Make sure to serve your static assets from this directory (not `/src` directory).

Your WordPress theme structure at this step should look like below:
```
theme-name
|   package.json
|   gulpfile.babel.js
|
└───dest
|   └───images
|   └───js
|   └───css

└───src
|   └───images
|   └───js
|   └───sass  
|
|   style.css
|   index.php
|   ... other php files
```

### Notes
I keep main `style.css` in the root directory of the theme with a header comment section only.
Other styles I keep in /src/sass and then serve from /dest/css directory. 

Happy coding! 😎






