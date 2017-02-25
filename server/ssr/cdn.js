module.exports = function renderCDN () {
  // TODO: read package.json for versioning.
  const resources = {
    'axios': 'https://cdnjs.cloudflare.com/ajax/libs/axios/0.15.3/axios.min.js',
    'babel-polyfill': 'https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.22.0/polyfill.min.js',
    'react': 'https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react.min.js',
    'react-dom': 'https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react-dom.min.js',
    'react-router': 'https://cdnjs.cloudflare.com/ajax/libs/react-router/4.0.0-beta.5/react-router.min.js',
    'react-redux': 'https://cdnjs.cloudflare.com/ajax/libs/react-redux/5.0.2/react-redux.min.js',
    'redux': 'https://cdnjs.cloudflare.com/ajax/libs/redux/3.6.0/redux.min.js',
    'redux-thunk': 'https://cdnjs.cloudflare.com/ajax/libs/redux-thunk/2.2.0/redux-thunk.min.js'
  };

  // returns string for appending to document head.
  return Object.keys(resources).map(lib => {
    return `<script type="text/javascript" src="${resources[lib]}"></script>`;
  }).join('');
}
