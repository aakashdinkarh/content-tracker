const infoIcon = document.getElementById('infoIcon');
const infoPopover = document.getElementById('infoPopover');

infoIcon.addEventListener('click', () => {
  // Toggle the visibility of the popover
  infoPopover.classList.toggle('active');
  infoIcon.classList.toggle('active');
});

// Close the popover when clicking outside
document.addEventListener('click', (event) => {
  if (!infoIcon.contains(event.target) && !infoPopover.contains(event.target)) {
    infoPopover.classList.remove('active');
    infoIcon.classList.remove('active');
  }
});
