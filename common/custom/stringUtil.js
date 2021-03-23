const stringUtil = {
    replaceWrap: function (str) {
        return str.replace(/[\r\n]/g, "");
    },
    replaceSpace: function (str) {
        return str.replace(/\ +/g, "");
    },
    replaceWrapAndSpace: function (str) {
        return str.replace(/\s+/g, "");
    },
    toUpperCase: function (str) {
        return str.toUpperCase();
    },
    toLowerCase: function (str) {
        return str.toLowerCase();
    },
    hump: function (str) {
        return str.replace(/\ +([A-Za-z])/g, function (keb, item) {
            return item.toUpperCase();
        });
    },
    replaceWrapAndSpaceHump: function (str) {
        return str.replace(/\s+([A-Za-z])/g, function (keb, item) {
            return item.toUpperCase();
        });
    },
    replaceLined: function (str) {
        return str.replace(/-/g, "");
    },
    replaceBottomLined: function (str) {
        return str.replace(/_/g, "");
    },
    replaceLinedToBottomLined: function (str) {
        return str.replace(/-/g, "_");
    },
    replaceBottomLinedToLined: function (str) {
        return str.replace(/_/g, "-");
    },
    replaceLinedHump: function (str) {
        return str.replace(/-([A-Za-z])/g, function (keb, item) {
            return item.toUpperCase();
        });
    },
    replaceBottomLinedHump: function (str) {
        return str.replace(/_([A-Za-z])/g, function (keb, item) {
            return item.toUpperCase();
        });
    },
    replaceJSONSpace: function (str) {
        return JSON.stringify(JSON.parse(str));
    },
    spreadJSON: function (str) {
        return JSON.stringify(JSON.parse(str), null, 2)
    }
};

export default stringUtil;