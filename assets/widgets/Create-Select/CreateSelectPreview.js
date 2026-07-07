import PropTypes from 'prop-types';
import React from 'react';
import { List } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { WidgetPreviewContainer } from 'decap-cms-ui-default';

function ListPreview({ values }) {
  return React.createElement(
    'ul',
    null,
    values.map((value, idx) => React.createElement('li', { key: idx }, value)),
  );
}

function SelectPreview({ value }) {
  const content = value ? (List.isList(value) ? React.createElement(ListPreview, { values: value }) : value) : null;
  return React.createElement(WidgetPreviewContainer, null, content);
}

SelectPreview.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, ImmutablePropTypes.list]),
};

export default SelectPreview;
