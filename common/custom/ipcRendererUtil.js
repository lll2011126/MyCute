const {ipcRenderer} = require('electron');

const ipcRendererUtil = {
    switchPage: function (id, urlPath) {
        ipcRenderer.send('switch-page', id, urlPath);
    }
};
export default ipcRendererUtil;