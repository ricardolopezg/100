import React, {PropTypes} from 'react';
import { uniqueId } from 'underscore';

const Icon = (props) => {
  const id = uniqueId();
  return (
    <svg viewBox='0 0 16 16' role='img'
    className={`icon icon-${props.icon}`}
    aria-labelledby={
      (props.title ? `title-${id}` : '') +
      (props.desc ? ` desc-${id}` : '')
    }>
      {props.title && <title id={`title-${id}`}>{props.title}</title>}
      {props.desc && <desc id={`desc-${id}`}>{props.desc}</desc>}
      <use xlinkHref={`#icon-${props.icon}`} />
    </svg>
  );
}

export default Icon;

Icon.propTypes = {};
