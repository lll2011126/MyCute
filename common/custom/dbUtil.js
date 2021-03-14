const {remote} = require('electron');
const low = require('lowdb');

const FileSync = require('lowdb/adapters/FileSync');  // 有多种适配器可选择
const shortId = require('shortid');

const adapter = new FileSync('db.json'); // 申明一个适配器
const db = low(adapter);
//
// db.defaults({posts: [], user: {}, count: 0})
//     .write();
//
// db.get('posts')
//     .push({id: 1, title: 'lowdb is awesome'})
//     .write()
//
// db.set('user.name', 'typicode')
//     .write()
//
// db.update('count', n => n + 1)
//     .write()
var planTableColumn = ['id', 'title', 'content', 'createDate', 'updateDate'];

function column(columnName, data) {
    let column = {};
    for (let i = 0; i < columnName.length; i++) {

    }
}

const dbUtil = {
        check: function () {
            remote.app.console(db.get('user.name').value());

        },
        get: function (tableName) {
            let data = db.read().get(tableName).value();
            return data;
        }
    }
;
export default dbUtil;
