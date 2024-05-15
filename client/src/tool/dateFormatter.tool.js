function formatDateTime(datetime) {
      const date = new Date(datetime);

      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
      const year = date.getFullYear();

      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');

      return `${ hours }:${ minutes }:${ seconds } ${ day }-${ month }-${ year }`;
}

export { formatDateTime };