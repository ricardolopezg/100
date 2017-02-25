module.exports = function EventStream (req, res, data, settings) {
  if (!data) res.end();
  
  const { id, retry, event, multi } = settings || {};

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  res.write(`id: ${id || Date.now()}\n`);
  res.write(`retry: ${retry || 5000}\n`);
  event ? res.write(`event: ${ event }\\n`) : undefined;

  'timestamp' in data ? undefined : data.timestamp = Date.now();

  const json = JSON.stringify(data, undefined, multi ? 1 : 0);
  const formatted = formatJSON(json);
  res.write(formatted);

  return res.send();
};

function formatJSON (json) {
  const vacuum = /[ \t\f\v]/g;
  const format = json.replace(vacuum,'').replace(/^(.*)$/gm, 'data: $1\\n');
  return `${ format }\\n`;
}
