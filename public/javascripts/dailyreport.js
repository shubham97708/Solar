$('#sold').click(() => {
    const date1 = $('#date1').val();
    const date2 = $('#date2').val();
    if (date1 != "" && date2 == "") {
        window.location.href = `/dailyreport/sold/${date1}`;
    } else if (date2 != "" && date1 == "") {
        window.location.href = `/dailyreport/sold/${date2}`;
    } else if (date2 != "" && date1 != "") {
        window.location.href = `/dailyreport/sold/${date1}/${date2}`;
    } else if (date1 == "" && date2 == "") {
        alert('Please Enter a date ');
        return;
    }
});

/*
$('#sold').click(() => {
    const date = $('#date1').val();

    if (date == "") {
        alert('Please Enter a date ');
        return;
    } else {
        window.location.href = `/dailyreport/sold/${date}`;
    }
});

*/




/* 
$('#transfers').click(() => {
    const date = $('#date').val();
    if ($('#date').val() == "") {
        alert('Please Enter a date');
        return;
    } else {
        window.location.href = `/dailyreport/transfer/${date}`;
    }
}); */

$('#transfers').click(() => {

    const date1 = $('#date1').val();
    const date2 = $('#date2').val();
    if (date1 != "" && date2 == "") {
        window.location.href = `/dailyreport/transfer/${date1}`;

    } else if (date2 != "" && date1 == "") {
        window.location.href = `/dailyreport/transfer/${date1}`;
    } else if (date2 != "" && date1 != "") {
        // window.location.href = `/dailyreport/transfer/${date1}`;
        window.location.href = `/dailyreport/transfer/${date1}/${date2}`;
    } else if (date1 == "") {
        alert('Please Enter a date ');
        return;
    }

});