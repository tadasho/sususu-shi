import { handler, assignToIssue } from "../src";
import * as assert from "assert";

// test function handler
function test1() {
    handler({
        "type": "event_callback",
        "event": {
            "text": "tada assign sususu-shi#1",
            "bot_id": false
        }
    }, null, function (error) {
        assert(error === null);
    });
}

function test2() {
    var num = 2;
    assert(num === 2);
}
test2();

// test function assignToIssue 
function test3() {
    assert(assignToIssue);
    assert(typeof assignToIssue === "function");
    assignToIssue({"text": "tada assign sususu-shi#1",
            "bot_id": false}, function (error) {
        assert(error === null);
    })
}
test3();

// test function createReviewPullRequest
function test4() {

}
