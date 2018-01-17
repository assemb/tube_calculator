document.addEventListener('DOMContentLoaded', function(){

  'use strict';

  var pinpad = document.querySelector('.pinpad');
  var display = document.querySelector('.display');
  var answer = display.querySelector('.display__answer');
  var history = display.querySelector('.display__history');
  var cells = display.querySelectorAll('.display__cell');

  var entry = '';
  var ans = '';
  var current = '';
  var log = '';
  var decimal = true;
  var reset = '';

  function showCells(val) {

    if (val.length > 8) return;
    for (var i = 0; i < cells.length; i++) {
      cells[i].className = 'display__cell';
    }

    var j = val.length - 1;
    i = cells.length - 1;

    while (j >= 0) {
      if (val[j] === '.') {
        cells[i].className += ' display__cell--dot';
        j--;
        continue;
      }
      if (val[j] === '-') {
        cells[i--].className += ' display__cell--minus';
      }
      cells[i--].className += ' display__cell--' + val[j--];
    }
  }

  function round(val) {
    val = val.toString().split('');
    if (val.indexOf('.') !== -1) {
      var valTest = val.slice(val.indexOf('.') + 1, val.length);
      val = val.slice(0, val.indexOf('.') + 1);
      var i = 0;
      while (valTest[i] < 1) {
        i++;
      }
      valTest = valTest.join('').slice(0, i + 2);
      if (valTest[valTest.length-1] === '0') {
        valTest = valTest.slice(0, -1);
      }
      return val.join('') + valTest;
    } else {
      return val.join('');
    }
  }


  pinpad.addEventListener('click', function(event) {
    var target = event.target;
    entry = target.textContent;

    if (reset) {
      if (entry === '/' || entry === '*' || entry === '-' || entry === '+') {
        log = ans;
      } else {
        ans = '';
      }
    }
    reset = false;

    // All clear or Clear Entry
    if (entry === 'AC' || entry === 'CE' && current === 'noChange') {
      ans = '';
      current = '';
      entry = '';
      log = '';
      history.textContent = '0';
      answer.textContent = '0';
      showCells('0');
      decimal = true;
    } else if (entry === 'CE') {
      history.textContent = log.slice(0, -current.length);
      log = log.slice(0, -current.length);
      ans = ans.slice(0, -current.length);
      current = ans;
      if (log.length === 0 || log === ' ') {
        history.textContent = '0';
      }
      answer.textContent = '0';
      showCells('0');
      entry = '';
      decimal = true;
    }

    // prevents more than one deciminal in a number
    if (entry === '.' || entry === '0.') {
      if (!decimal) {
        entry = '';
      }
    }

    // prevents improper use of first digit
    if (ans.length === 0 && isNaN(entry) && entry !== '.' || ans.length === 0 && entry === '0') {
      entry = '';
      ans = '';
    }

    // prevents extra operators
    if (current !== 'noChange') {
      if (current === '' && isNaN(entry) && entry !== '.' || isNaN(current) && isNaN(entry) && entry !== '.') {
        entry = '';
      }
    }

    // digit combining
    while (Number(entry) || entry === '0' || current === '.') {

      if (isNaN(current) && entry === '0' && current !== '.') {
        entry = '';
      } else if (isNaN(current) && Number(entry) && current !== '.') {
        current = '';
      }
      if (entry === '.') {
        decimal = false;
      }
      if (current === '0.' && isNaN(entry)) {
        entry = '';
      } else {
        if (current[current.length - 1] === '.') {
          current = current.concat(entry);
        } else {
          current += entry;
        }
        ans += entry;
        answer.textContent = current;
        showCells(current);
        log += entry;
        history.textContent = log;
        entry = '';
      }
    }

    // Operation list

    if (entry === '.') {
      if (current === '' || isNaN(current[current.length - 1])) {
        current = '0.';
        ans += entry;
        answer.textContent = '0.';
        showCells('0.');
        log += current;
        history.textContent = log;

      } else {
        current = current.concat('.');
        ans = ans.concat('.');
        log = ans;
        history.textContent = ans;
        answer.textContent = current;
        showCells(current);
      }
      entry = '';
      decimal = false;

    } else if (entry === '/') {
      current = '/';
      ans = ans + current;
      log += current;
      history.textContent = log;
      entry = '';
      decimal = true;

    } else if (entry === '*') {
      current = '*';
      ans = ans + current;
      log += 'x';
      history.textContent = log;
      entry = '';
      decimal = true;

    } else if (entry === '-') {
      current = '-';
      ans = ans + current;
      log += current;
      history.textContent = log;
      entry = '';
      decimal = true;

    } else if (entry === '+') {
      current = '+';
      ans = ans + current;
      log += current;
      history.textContent = log;
      entry = '';
      decimal = true;

    } else if (entry === '=') {
      if (current[current.length - 1] === '.') {
        entry = '';
      } else {
        current = eval(ans).toString();
        answer.textContent = (round(eval(ans)));
        showCells(round(eval(ans)));
        ans = round(eval(ans));
        log += entry + ans;
        history.textContent = log;
        log = ans;
        entry = '';
        reset = true;
        decimal = true;
      }
      current = 'noChange';
    }
    entry = '';

    if (reset) {
      log = '';
    }

    // max digits on screen

    if (answer.textContent.length > 8 || history.textContent.length > 22) {
      answer.textContent = '0';
      showCells('0');
      history.textContent = 'Digit Limit Met';
      current = '';
      ans = '';
      log = '';
      decimal = true;
    }

  });

});