import controlComponent from './CreateSelectControl';
import previewComponent from './CreateSelectPreview';
import schema from './schema';

function Widget(opts = {}) {
  return {
    name: 'create-select',
    controlComponent,
    previewComponent,
    schema,
    ...opts,
  };
}

export const DecapCmsWidgetSelect = { Widget, controlComponent, previewComponent };
export default DecapCmsWidgetSelect;
