var webpack = require('webpack');

// UDEMY TEACHER VERSION
module.exports = {
  entry:  [
    'script!jquery/dist/jquery.min.js',
    'script!foundation-sites/dist/foundation.min.js',
    './app/app.jsx'
  ],
  externals: {
    jquery: 'jQuery'
  },
  plugins: [
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery'
    })
  ],
  output: {
    path: __dirname,
    filename: './public/bundle.js'
  },
  resolve: {
    root: __dirname,
    alias: {
      Main: 'app/components/Main.jsx',
      applicationStyles: 'app/styles/app.scss'
    },
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015','stage-0']
        },
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  devtool: 'cheap-module-eval-source-map'
};


// MIKE'S VERSION
// const path = require('path'); // a native node module
//
// module.exports = {
//   context: path.join(__dirname, 'app'), // where the app lives
//   entry: {
//     app: './app.jsx' // no need for './app/app.jsx' because of context
//   },
//   output: {
//     path: path.resolve(__dirname, 'public'),
//     publicPath: '', // default is '', this is where your virtual build directory is.
//     filename: 'bundle.[name].js' // because we made entry an object, we can [name] it and add multiple entry points as well.
//   },
//   resolve: {
//     root: path.resolve(__dirname),
//     modulesDirectories: ['node_modules', 'bower_components'], // this is where your modules are. In WP2, its just 'modules': []
//     alias: {
//       Main: 'app/components/Main.jsx',
//       Nav: 'app/components/Nav.jsx',
//       Weather: 'app/components/Weather.jsx',
//       // really cool ability to ref your code like require('components/Clock.jsx') inside your own code.
//       components: path.join(__dirname, 'app', 'components'),
//       // or you can write it like this in your code: require('styles/normalize.css') instead of '../../..'
//       styles: path.resolve(__dirname, 'app/styles')
//     },
//     extensions: ['', '.js', '.jsx'] // in WP2, that '' string will throw a fit, '*' helps tho.
//   },
//   module: {
//     loaders: [
//       {
//         loader: 'babel-loader', // you also don't need '*-loader' suffix, you can just do 'babel'.
//         test: /\.jsx?$/,
//         exclude: /(node_modules|bower_components)/
//       }
//     ]
//   }
// };
