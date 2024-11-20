export function formatDateForList(dateObject: Date): string {
  const newDate = new Date(dateObject);
  let month = String(newDate.getMonth() + 1);
  if (String(newDate.getMonth()).length < 2) {
    month = String(newDate.getMonth() + 1).padStart(2, '0');
  }
  let date = String(newDate.getUTCDate());
  if (String(newDate.getUTCDate()).length < 2) {
    date = String(newDate.getUTCDate()).padStart(2, '0');
  }
  return month + '-' + date + '-' + newDate.getFullYear();
}

export function formatDateForEdit(dateObject: Date): string {
  const newDate = new Date(dateObject);
  let month = String(newDate.getMonth() + 1);
  if (String(newDate.getMonth()).length < 2) {
    month = String(newDate.getMonth() + 1).padStart(2, '0');
  }
  let date = String(newDate.getUTCDate());
  if (String(newDate.getUTCDate()).length < 2) {
    date = String(newDate.getUTCDate()).padStart(2, '0');
  }
  return newDate.getFullYear() + '-' + month + '-' + date;
}
