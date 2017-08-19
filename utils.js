function taskComparator(a, b) {
  // Place tasks with a deadline before tasks without a deadline.
  if (a.deadline && !b.deadline) {
    return -1;
  } else if (b.deadline && !a.deadline) {
    return 1;
  }

  // Sort tasks by their deadlines.
  if (a.deadline && b.deadline) {
    var deadlineA = new Date(a.deadline);
    var deadlineB = new Date(b.deadline);

    deadlineA.setHours(0);
    deadlineA.setMinutes(0);
    deadlineA.setSeconds(0);
    deadlineA.setMilliseconds(0);

    deadlineB.setHours(0);
    deadlineB.setMinutes(0);
    deadlineB.setSeconds(0);
    deadlineB.setMilliseconds(0);

    if (deadlineA < deadlineB) {
      return -1;
    } else if (deadlineA > deadlineB) {
      return 1;
    }
  }

  // Sort tasks by completion.
  if (a.completed && !b.completed) {
    return 1;
  } else if (b.completed && !a.completed) {
    return -1;
  }

  // Sort tasks by deadline time.
  if (a.deadline && b.deadline) {
    if (a.deadlineTime && !b.deadlineTime) {
      return -1;
    } else if (b.deadlineTime && !a.deadlineTime) {
      return 1;
    }

    // Sort by raw deadline.
    var deadlineA = new Date(a.deadline);
    var deadlineB = new Date(b.deadline);
    if (deadlineA < deadlineB) {
      return -1;
    } else if (deadlineA > deadlineB) {
      return 1;
    }
  }

  return 0;
}
