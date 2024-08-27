// Filterdropdown-------------------------------------- 
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("showd");
}
$(".dropbtn").on('click', function() {
    $(this).toggleClass('is-active').next(".option-content").stop().slideToggle(500);
  });


// Filter-----------------------------------------
$('input[type="radio"], select').change(function() {
  filterNow();
});

function filterNow() {
  var list = $(".news-list .news-item");
  $(list).fadeOut("fast");

  var filtered = $(".news-list article");

  // Get selected values from radio buttons and select dropdown
  var rarity = $('input[name="rarity"]:checked').val();
  var faction = $('input[name="faction"]:checked').val();
 function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

var city = $('select#sort-tire').val();

// Escape the city value
var escapedCity = escapeRegExp(city);

filtered = filtered.filter(function() {
    const rarityMatch = rarity === '.' || $(this).attr("data-rarity") === rarity;
    const factionMatch = faction === '.' || $(this).attr("data-faction") === faction;
    const cityMatch = city === '.' || RegExp('^' + escapedCity + '$').test($(this).attr("data-tire"));
  
    return rarityMatch && factionMatch && cityMatch;
});
  

  if (filtered.length === 0) {
  } else {
    filtered.each(function(i) {
      $(this).delay(100).fadeIn("fast");
    });
  }
}


// Popup--------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    const newsItems = document.querySelectorAll('.news-item');
    const overlay = document.querySelector('.overlay');

    newsItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.add('active');
            overlay.classList.add('active');
        });

        const closeButton = item.querySelector('.close-btn');
        closeButton.addEventListener('click', function(e) {
            
            e.stopPropagation();
            
            item.classList.remove('active');
            overlay.classList.remove('active');
        });
    });

    
    overlay.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});


// Search--------------------------------------
document.getElementById('search-input').addEventListener('keyup', function() {
    var searchTerm = this.value.toLowerCase();
    var articles = document.querySelectorAll('.news-item');

    articles.forEach(function(article) {
        var articleText = article.innerText.toLowerCase();
        if (articleText.includes(searchTerm)) {
            article.style.display = '';
        } else {
            article.style.display = 'none';
        }
    });
});

$('#search-input').on('input', function() {
    resetFilters();
  });

 function resetFilters() {
    $('input[name="rarity"][value="."]').prop('checked', true);
    $('input[name="faction"][value="."]').prop('checked', true);
    $('select#sort-city').val(".");
  }
  




// TireColor-------------------------------------- 
$(document).ready(function() {
    $('.news-item').each(function() {
        var tierText = $(this).find('.maintire').text().trim();
        var tireDiv = $(this).find('.tire');

        if (tierText === 'S+') {
            $(this).attr('data-tire', 'S+');
            tireDiv.text('S+');
            tireDiv.css('background-color', '#673AB7');
        } 
        else if (tierText === 'S') {
            $(this).attr('data-tire', 'S');
            tireDiv.text('S');
            tireDiv.css('background-color', '#737ddc');
        } 
        else if (tierText === 'A+') {
            $(this).attr('data-tire', 'A+');
            tireDiv.text('A+');
            tireDiv.css('background-color', '#8ac3d8');
        } 
        else if (tierText === 'A') {
            $(this).attr('data-tire', 'A');
            tireDiv.text('A');
            tireDiv.css('background-color', '#7dd8c9');
        } 
        else if (tierText === 'B+') {
            $(this).attr('data-tire', 'B+');
            tireDiv.text('B+');
            tireDiv.css('background-color', '#7fd2a6');
        } 
        else if (tierText === 'B') {
            $(this).attr('data-tire', 'B');
            tireDiv.text('B');
            tireDiv.css('background-color', '#c3d985');
        } 
        else if (tierText === 'C+') {
            $(this).attr('data-tire', 'C+');
            tireDiv.text('C+');
            tireDiv.css('background-color', '#e8d17c');
        } 
        else if (tierText === 'C') {
            $(this).attr('data-tire', 'C');
            tireDiv.text('C');
            tireDiv.css('background-color', '#e5806d');
        } 
        else if (tierText === 'D') {
            $(this).attr('data-tire', 'D');
            tireDiv.text('D');
            tireDiv.css('background-color', '#ff0000');
        } 
        else if (tierText === 'E') {
            $(this).attr('data-tire', 'E');
            tireDiv.text('E');
            tireDiv.css('background-color', '#a61c00');
        } 
        else if (tierText === 'F') {
            $(this).attr('data-tire', 'F');
            tireDiv.text('F');
            tireDiv.css('background-color', '#5b0f00');
        }
        else if (tierText === 'NEW') {
            $(this).attr('data-tire', 'NEW');
            tireDiv.text('NEW');
            tireDiv.css('background-color', '#f00');
        }
    });
          
});