import windowControl from "../../../common/custom/windowControl.js";

$(document).ready(function () {
    // history.back(-1);
    $("#demo").jstree({
        'core': {
            "data": [
                {
                    "id": "0",
                    "text": "根节点1",
                    "state": {"opened": true},
                    "children": [
                        {'text': 'child1'},
                        {'text': 'child2'},
                    ]
                },
                {
                    "id": "1",
                    "text": "根节点2",
                    "children": [
                        {'text': 'child1'},
                        {'text': 'child2'},
                    ]
                },
            ]
        }
    });
});