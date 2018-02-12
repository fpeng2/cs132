function triangle() {
    $(".warning, .tri-info").each(function(idx, item) {
        item.style["display"] = "none";
    });
    var sides = [], returned = false;
    $(".sides").each(function(idx, item) {
        if (item.value <= 0) {
            $("#neg-nums")[0].style["display"] = "block";
            returned = true;
            return;
        }
        sides.push(Number(item.value));
    });
    if (returned) {
        return;
    }
    sides.sort();
    if (sides[0] + sides[1] <= sides[2]) {
        document.getElementById("non-triangle").style["display"] = "block";
        return;
    }
    var max_ang = calcAngle(sides);
    calcType(sides, max_ang);
    var perimeter = calcPeri(sides);
    calcArea(sides, perimeter);
    $(".tri-info").each(function(idx, item) {
        item.style["display"] = "block";
    });
    return;
}

function calcAngle(sides) {
    var top = sides[1] * sides[1] +  sides[2] * sides[2] - sides[0] * sides[0];
    var cos = top / (2 * sides[1] * sides[2]);
    var ang = Math.acos(cos) * 180 / Math.PI;
    $("#angle1")[0].innerHTML = ang.toFixed(2) + "&deg;";

    top = sides[0] * sides[0] +  sides[2] * sides[2] - sides[1] * sides[1];
    cos = top / (2 * sides[0] * sides[2]);
    ang = Math.acos(cos) * 180 / Math.PI;
    $("#angle2")[0].innerHTML = ang.toFixed(2) + "&deg;";

    top = sides[0] * sides[0] +  sides[1] * sides[1] - sides[2] * sides[2];
    cos = top / (2 * sides[0] * sides[1]);
    ang = Math.acos(cos) * 180 / Math.PI;
    $("#angle3")[0].innerHTML = ang.toFixed(2) + "&deg;";

    return ang;
}

function calcType(sides, max_ang) {
    if (max_ang > 90) {
        $("#type-angle")[0].innerText = "obtuse";
    } else if (max_ang == 90) {
        $("#type-angle")[0].innerText = "right";
    } else {
        $("#type-angle")[0].innerText = "acute";
    }

    if (sides[0] == sides[2]) {
        $("#type")[0].innerText = "equilateral";
        return;
    }
    if (sides[0] == sides[1] || sides[1] == sides[2]) {
        $("#type")[0].innerText = "isosceles";
        return;
    }
    $("#type")[0].innerText = "scalene";

    return;
}


function calcPeri(sides) {
    var perimeter = sides[0] + sides[1] + sides[2];
    $("#perimeter")[0].innerText = perimeter.toFixed(2);
    return perimeter;
}

function calcArea(sides, perimeter) {
    var s = perimeter / 2;
    var area = Math.sqrt(s * (s - sides[0]) *  (s - sides[1]) * (s - sides[2]));
    $("#area")[0].innerText = area.toFixed(2);
    return;
}
