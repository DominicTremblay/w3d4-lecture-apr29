$(document).ready(function() {
  // Get the info from json
  // Create an Ajax request to get the json of the quotes
  // Array of objects

  const request = (options, cb) => {
    $.ajax(options)
      .done(response => {
        cb(response);
      })
      .fail(err => console.log('Error', err))
      .always(() => console.log('Request completed.'));
  };

  // create a quote HTML element

  const createQuoteEl = quoteObj => {
    const quoteEl = `<div class="card">
  <div class="card-header" id="${quoteObj._id}">
    <h5 class="mb-0">
      <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#${
        quoteObj._id
      }" aria-expanded="true" aria-controls="5c93486deb1896280bf3b720" style="visibility: visible;">${
      quoteObj.quote
    }</button>
      <div>
        <form class="quote-update-frm" style="visibility: hidden;">
          <input type="text" name="editquote" class="edit-quote" value="${
            quoteObj.quote
          }">
          <input type="submit" class="btn-small btn-primary" value="Update">
        </form>
      </div>
    </h5>

    <span>
      <form class="quote-edit-frm"><input type="submit" class="btn btn-secondary btn-sm" value="Edit"></form>
      <form class="quote-delete-frm"><input type="submit" class="btn btn-secondary btn-sm" value="Delete"></form>
    </span>

  </div>
</div>`;
    return quoteEl;
  };

  // Loop throught the array of quotes
  // Create all the quote Element
  // Add each one to the DOM
  const renderQuotes = quoteArr => {
    $.each(quoteArr, (index, quote) => {
      // Add the elements to the DOM with append
      $('#quote-list').prepend(createQuoteEl(quote));
    });
  };

  const loadQuotes = () => {
    const reqOptions = {
      method: 'GET',
      url: '/quotes',
      dataType: 'json',
    };

    // Trigger the Ajax request using reqOptions
    request(reqOptions, quoteArr => {
      // Callback is how we want to deal with the result
      renderQuotes(quoteArr);
    });
  };

  // catch the onsubmit event of the form with id add-quote-frm
  $('#add-quote-frm').on('submit', function(event) {
    // Stop the normal submission of the form
    event.preventDefault();

    // Extract the information from the form
    const quoteContent = $(this)
      .find('#quote')
      .val();
    console.log(quoteContent);

    // Create the Ajax post request
    const reqOptions = {
      method: 'POST',
      url: '/quotes',
      data: { quote: quoteContent },
    };

    request(reqOptions, quote => {
      // add my quoteElement to the list
      renderQuotes([quote]);
    });
  });

  // Load all the quotes
  loadQuotes();
});
