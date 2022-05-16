const convert = (x) => x < 10 ? '0' + String(x) : String(x)
const convertDate = (date) => {
  date = new Date(date)
  return `${date.getFullYear()}-${convert(date.getMonth() + 1)}-${convert(date.getDate())} ${convert(date.getHours())}:${convert(date.getMinutes())}:${convert(date.getMinutes())}`
}

module.exports = {
  convertDate
}