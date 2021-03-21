const {remote} = require('electron');
const path = require('path');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');  // 有多种适配器可选择
const adapter = new FileSync('resources/db.json'); // 申明一个适配器
const db = low(adapter);

// const adapter = new FileSync(path.join(__dirname, '../../static/db.json'));
// const db = low(adapter);

const shortId = require('shortid');
const dbUtil = {
    shortId: function () {
        return shortId.generate();
    },
    nowDate: function (date) {
        if (date == undefined || date == null) {
            date = new Date();
        }
        return date.toLocaleDateString().replace(/\//g, "-") + " " + date.toTimeString().substr(0, 8)
    },
    getAllByTableName: function (tableName) {
        let data = db.read().get(tableName).value();
        return data;
    },
    removeByIds: function (tableName, id) {
        id.forEach(function (item, index) {
            db.read().get(tableName).remove({id: item}).write();
        });
    },
    insert: function (tableName, newData) {
        db.read().get(tableName).push(newData).write();
    },
    updateById: function (tableName, id, newData) {
        db.read().get(tableName).find({id: id}).assign(newData).write();
    }
};
export default dbUtil;
