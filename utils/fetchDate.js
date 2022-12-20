module.exports.fetchDate = function() {
    const date = new Date();

    let day = date.getDate();
    let year = date.getFullYear();

    let month = date.toLocaleString('default', { month: 'short' })


    return `${month}-${day}-${year}`;
}