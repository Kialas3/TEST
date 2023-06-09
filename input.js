/*
* all the code for homework 2 goes into this file.
You will attach event handlers to the document, workspace, and targets defined in the html file
to handle mouse, touch and possible other events.

You will certainly need a large number of global variables to keep track of the current modes and states
of the interaction.
*/

const targets = document.getElementsByClassName("target");
var dbclick = 0;
var target;
var for_touch_index = -1;
var target_index;
var change_color = false;
var index_change_bkc = -1;
var startX = 0;
var startY = 0;
var mouseX;
var mouseY;
var down_mouseX;
var down_mouseY;
var down_touchX;
var down_touchY;
var up_touchX;
var up_touchY;
var touchX;
var touchY;
var touch1_startX;
var touch1_startY;
var touch2X;
var touch2Y;
var touch2_startX;
var touch2_startY;
var originX;
var originY;
var latest_touch;
var dbtouch = 0;
var touch_start;
var touch_end;
var finger1;
var finger2;
var finger_time;
var horz1_vert0;
var had_change = 0;
var original_height;
var original_width;


for (let i = 0; i < targets.length; i++) {
    targets[i].addEventListener("mousedown", (e) => {
        e.preventDefault();

        // originX = targets[i].style.left;
        // originY = targets[i].style.top;
        // startX = e.clientX - targets[i].offsetLeft;
        // startY = e.clientY - targets[i].offsetTop;
        // target = targets[i];

        if (dbclick) {
            document.addEventListener('mouseup', mouseup);
            console.log("dbclick");
        } else {
            originX = targets[i].style.left;
            originY = targets[i].style.top;
            startX = e.clientX - targets[i].offsetLeft;
            startY = e.clientY - targets[i].offsetTop;
            target = targets[i];
            document.addEventListener("mousemove", mousemove);
            document.addEventListener('mouseup', mouseup);
            document.addEventListener('keydown', remove);
            console.log("click");
        }
    }, true);
    targets[i].addEventListener("touchstart", (e) => {
        e.preventDefault();

        // originX = targets[i].style.left;
        // originY = targets[i].style.top;
        // startX = e.touches[0].clientX - targets[i].offsetLeft;
        // startY = e.touches[0].clientY - targets[i].offsetTop;
        // target = targets[i];

        if (dbtouch) {
        } else {
            originX = targets[i].style.left;
            originY = targets[i].style.top;
            startX = e.touches[0].clientX - targets[i].offsetLeft;
            startY = e.touches[0].clientY - targets[i].offsetTop;
            target = targets[i];
            document.addEventListener("touchmove", touchmove);
            document.addEventListener('keydown', remove);
        }
    }, true);

    targets[i].addEventListener("click", (e) => {
        e.preventDefault();
        if (dbclick) {
        } else {
            if (change_color) {
                if (index_change_bkc != -1) {
                    targets[index_change_bkc].classList.toggle("change_bkc");
                }
                targets[i].classList.toggle("change_bkc");
                index_change_bkc = i;
            }
        }
        dbclick = 0;
    });
    targets[i].addEventListener("dblclick", (e) => {
        e.preventDefault();
        startX = e.clientX - targets[i].offsetLeft;
        startY = e.clientY - targets[i].offsetTop;
        target = targets[i];
        dbclick = 1;
        document.addEventListener("mousemove", mousemove);
        document.addEventListener('keydown', remove);
    })
    targets[i].addEventListener("touchend", (e) => {
        e.preventDefault();
        if (dbtouch) {
            document.addEventListener("touchmove", touchmove);
            document.addEventListener('keydown', remove);
        } else {
            if (change_color) {
                if (index_change_bkc != -1) {
                    targets[index_change_bkc].classList.toggle("change_bkc");
                }
                targets[i].classList.toggle("change_bkc");
                index_change_bkc = i;
            }
        }
    });
}

const workspace = document.getElementById("workspace");

workspace.addEventListener("mousedown", () => {
    down_mouseX = mouseX;
    down_mouseY = mouseY;
});
workspace.addEventListener("touchstart", (e) => {

    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
    touch1_startX = e.touches[0].clientX;
    touch1_startY = e.touches[0].clientY;

    if (e.touches.length == 1) {
        finger1 = e.timeStamp;
        touch_start = new Date().getTime();

        down_touchX = touchX;
        down_touchY = touchY;
        had_change = 0;

        if (index_change_bkc != -1) {
            original_height = targets[index_change_bkc].style.height;
            original_width = targets[index_change_bkc].style.width;
        };
    } else if (e.touches.length == 2) {
        finger2 = e.timeStamp;
        touch2X = e.touches[1].clientX;
        touch2Y = e.touches[1].clientY;
        touch2_startX = e.touches[1].clientX;
        touch2_startY = e.touches[1].clientY;
        finger_time = finger2 - finger1;
        horz_or_vert();
        if (finger2 - finger1 < 200 || had_change == 1) {
            had_change = 1;
        } else {
            targets[index_change_bkc].style.left = originX;
            targets[index_change_bkc].style.top = originY;
            dbclick = 0;
            dbtouch = 0;
            document.removeEventListener("mousemove", mousemove);
            document.removeEventListener("touchmove", touchmove);
            document.removeEventListener("keydown", remove);
        }
    } else if (e.touches.length == 3) {
        targets[index_change_bkc].style.height = original_height;
        targets[index_change_bkc].style.width = original_width;
        targets[index_change_bkc].style.left = originX;
        targets[index_change_bkc].style.top = originY;
        dbclick = 0;
        dbtouch = 0;
        had_change = 0;
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("touchmove", touchmove);
        document.removeEventListener("keydown", remove);
    }
})

workspace.addEventListener("mouseup", mouseup);
workspace.addEventListener("click", () => {
    if (dbclick) {
    } else {
        if (change_color) {
            if (index_change_bkc != -1) {
                targets[index_change_bkc].classList.toggle("change_bkc");
            }
            index_change_bkc = -1;
        }
    }
}, true);
workspace.addEventListener("touchend", () => {
    touch_end = new Date().getTime();

    if (down_touchX == touchX && down_touchY == touchY) {
        if (touch_end - touch_start < 200) {
            dbtouch = 0;
        }
        change_color = true;
    } else {
        change_color = false;
    }
    if (target != targets[index_change_bkc]) {
        dbtouch = 0;
    }
    doubletouch();
    if (dbtouch) {
    } else {
        if (change_color) {
            if (index_change_bkc != -1) {
                targets[index_change_bkc].classList.toggle("change_bkc");
            }
            index_change_bkc = -1;
        }
        document.removeEventListener("touchmove", touchmove);
        document.removeEventListener('keydown', remove);
    }
    up_touchX = down_touchX;
    up_touchY = down_touchY;
}, true);

workspace.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});
workspace.addEventListener("touchmove", (e) => {
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;

    if (e.touches.length == 2) {
        document.removeEventListener("touchmove", touchmove);
        touch2X = e.touches[1].clientX;
        touch2Y = e.touches[1].clientY;
        if (finger2 - finger1 < 200 && had_change == 1) {
            if (index_change_bkc != -1) {
                if (horz1_vert0) {
                    targets[index_change_bkc].style.width = parseFloat(targets[index_change_bkc].style.width) + (Math.abs(touch2X - touchX) - Math.abs(touch2_startX - touch1_startX)) + 'px';
                    if (parseFloat(targets[index_change_bkc].style.width) < 10) {
                        targets[index_change_bkc].style.width = 10 + 'px';
                    } else {
                        targets[index_change_bkc].style.left = parseFloat(targets[index_change_bkc].style.left) - (Math.abs(touch2X - touchX) - Math.abs(touch2_startX - touch1_startX)) / 2 + 'px';
                    }
                } else {
                    targets[index_change_bkc].style.height = parseFloat(targets[index_change_bkc].style.height) + (Math.abs(touch2Y - touchY) - Math.abs(touch2_startY - touch1_startY)) + 'px';
                    if (parseFloat(targets[index_change_bkc].style.height) <= 10) {
                        targets[index_change_bkc].style.height = 10 + 'px';
                    } else {
                        targets[index_change_bkc].style.top = parseFloat(targets[index_change_bkc].style.top) - (Math.abs(touch2Y - touchY) - Math.abs(touch2_startY - touch1_startY)) / 2 + 'px';
                    }
                }
            }
        }
    }
    touch2_startX = touch2X;
    touch2_startY = touch2Y;
    touch1_startX = touchX;
    touch1_startY = touchY;
});

function remove(e) {
    if (e.code == 'Escape') {
        targets[index_change_bkc].style.height = original_height;
        targets[index_change_bkc].style.width = original_width;
        targets[index_change_bkc].style.left = originX;
        targets[index_change_bkc].style.top = originY;
        dbclick = 0;
        dbtouch = 0;
        had_change = 0;
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("touchmove", touchmove);
        document.removeEventListener("keydown", remove);
    }
}

function mouseup(e) {
    if (down_mouseX == mouseX && down_mouseY == mouseY) {
        change_color = true;
    } else {
        change_color = false;
    }
    document.removeEventListener("mousemove", mousemove);
    document.removeEventListener("mouseup", mouseup);
    document.removeEventListener("keydown", remove);
}

function mousemove(e) {
    x = mouseX - startX;
    y = mouseY - startY;
    target.style.left = x + 'px';
    target.style.top = y + 'px';
    console.log(dbclick);
}

function touchmove(e) {
    had_change = 0;
    x = touchX - startX;
    y = touchY - startY;
    target.style.left = x + 'px';
    target.style.top = y + 'px';
    document.addEventListener('keydown', remove);
}

function doubletouch() {
    var now = new Date().getTime();
    var timesince = now - latest_touch;
    latest_touch = new Date().getTime();
    if ((timesince < 600) && (timesince > 0) && Math.abs(up_touchX - down_touchX) < 10 && Math.abs(up_touchY - down_touchY) < 10) {
        dbtouch = 1;
    }
}

function horz_or_vert() {
    if (Math.abs(touch2_startX - touch1_startX) > Math.abs(touch2_startY - touch1_startY)) {
        horz1_vert0 = 1;
    } else {
        horz1_vert0 = 0;
    }
}