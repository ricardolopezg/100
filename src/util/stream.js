export default function EventStream (url, config) {
  if (!!window.EventSource) {
    var source = new EventSource(url, config);

    source.addEventListener('message', function(e) {
      if (e.origin !== location.origin) {
        return source.close();
      }
      console.log(e);
      console.log(e.data);
    }, false);

    source.addEventListener('open', function(e) {
      // Connection was opened.
      console.log('EventSource connection was opened');
    }, false);

    source.addEventListener('error', function(e) {
      if (e.readyState == EventSource.CLOSED) {
        // Connection was closed.
        console.log('EventSource connection experienced an error', e);
      }
    }, false);

    return source;
  } else {
    // Result to xhr polling :(
    return null;
  }
}
