document.addEventListener("DOMContentLoaded", async function () {
  const jobListContainer = document.getElementById("job-list");
  const filtersContainer = document.getElementById("filters");
  let selectedFilters = [];

  try {
    const response = await fetch("/data.json");
    const jobs = await response.json();

    function renderJobs(filteredJobs) {
      jobListContainer.innerHTML = "";
      filteredJobs.forEach(job => {
        const jobCard = document.createElement("div");
        jobCard.className = `
          bg-white p-6 shadow-lg rounded-lg flex flex-col md:flex-row md:items-center md:justify-between
          border-l-4 shadow-lg shadow-gray-300 ${job.featured ? "border-teal-600" : "border-gray-100"}
        `;

        jobCard.innerHTML = `
          <div class="flex items-center space-x-6 mt-5 md:mt-0">
            <img src="${job.logo}" alt="${job.company}" class="w-16 h-16 md:w-20 md:h-20 absolute -translate-y-20 md:relative md:-translate-0">
            <div>
              <div class="flex items-center space-x-3 mb-1">
                <span class="text-teal-600 font-bold">${job.company}</span>
                ${job.new ? '<span class="bg-Desaturated-Dark-Cyan text-Light-Grayish-Cyan text-xs font-bold px-2 py-1 rounded-full">NEW!</span>' : ''}
                ${job.featured ? '<span class="bg-gray-900 text-Light-Grayish-Cyan text-xs font-bold px-2 py-1 rounded-full">FEATURED</span>' : ''}
              </div>
              <h2 class="text-xl font-bold text-gray-900 hover:text-Desaturated-Dark-Cyan cursor-pointer transition-all duration-300 mb-2">${job.position}</h2>
              <p class="text-Dark-Grayish-Cyan text-sm font-medium">${job.postedAt} • ${job.contract} • ${job.location}</p>
            </div>
          </div>

          <div class="flex w-full border border-gray-300 md:hidden mt-4"></div>

          <div class="flex flex-wrap gap-3 mt-4 md:mt-0">
            <span class="filter-btn bg-Light-Grayish-Cyan text-Desaturated-Dark-Cyan px-3 py-1 text-sm font-bold rounded hover:bg-Desaturated-Dark-Cyan hover:text-Light-Grayish-Cyan cursor-pointer transition-all duration-300" data-filter="${job.role}">${job.role}</span>
            <span class="filter-btn bg-Light-Grayish-Cyan text-Desaturated-Dark-Cyan px-3 py-1 text-sm font-bold rounded hover:bg-Desaturated-Dark-Cyan hover:text-Light-Grayish-Cyan cursor-pointer transition-all duration-300" data-filter="${job.level}">${job.level}</span>
            ${job.languages.map(lang => `<span class="filter-btn bg-Light-Grayish-Cyan text-Desaturated-Dark-Cyan px-3 py-1 text-sm font-bold rounded hover:bg-Desaturated-Dark-Cyan hover:text-Light-Grayish-Cyan cursor-pointer transition-all duration-300" data-filter="${lang}">${lang}</span>`).join('')}
            ${job.tools.map(tool => `<span class="filter-btn bg-Light-Grayish-Cyan text-Desaturated-Dark-Cyan px-3 py-1 text-sm font-bold rounded hover:bg-Desaturated-Dark-Cyan hover:text-Light-Grayish-Cyan cursor-pointer transition-all duration-300" data-filter="${tool}">${tool}</span>`).join('')}
          </div>
        `;

        jobListContainer.appendChild(jobCard);
      });

      document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", function () {
          addFilter(this.dataset.filter);
        });
      });
    }

    function addFilter(filter) {
      if (!selectedFilters.includes(filter)) {
        selectedFilters.push(filter);
        updateFilterUI();
      }
    }

    function removeFilter(filter) {
      selectedFilters = selectedFilters.filter(f => f !== filter);
      updateFilterUI();
    }

    function updateFilterUI() {
      if (selectedFilters.length === 0) {
        filtersContainer.innerHTML = "";
        filtersContainer.classList.add("hidden");
        renderJobs(jobs); // Menampilkan semua pekerjaan jika tidak ada filter
        return;
      }
    
      filtersContainer.classList.remove("hidden");
    
      filtersContainer.innerHTML = `
        <div class="flex justify-between items-center w-full">
          <div class="flex flex-wrap gap-2">
            ${selectedFilters.map(filter => `
              <span class="selected-filter bg-Light-Grayish-Cyan text-Desaturated-Dark-Cyan px-3 py-1 text-sm font-bold rounded flex items-center gap-x-2">
                ${filter} 
                <button class="ml-2 bg-Desaturated-Dark-Cyan hover:bg-Very-Dark-Grayish-Cyan text-white px-2 py-1 text-sm font-bold rounded transition-all duration-300 remove-filter cursor-pointer" data-filter="${filter}">X</button>
              </span>
            `).join("")}
          </div>
          <button id="clear-filters" class="bg-none text-Desaturated-Dark-Cyan px-4 py-2 text-sm font-bold rounded cursor-pointer underline transition-all duration-300">
            Clear
          </button>
        </div>
      `;
    
      document.querySelectorAll(".remove-filter").forEach(btn => {
        btn.addEventListener("click", function () {
          removeFilter(this.dataset.filter);
        });
      });
    
      document.getElementById("clear-filters").addEventListener("click", clearFilters);
      
      applyFilters();
    }

    function applyFilters() {
      if (selectedFilters.length === 0) {
        renderJobs(jobs); // Jika tidak ada filter, tampilkan semua pekerjaan
        return;
      }
    
      const filteredJobs = jobs.filter(job =>
        selectedFilters.every(filter =>
          [job.role, job.level, ...job.languages, ...job.tools].includes(filter)
        )
      );
    
      renderJobs(filteredJobs);
    }

    function clearFilters() {
      selectedFilters = [];
      updateFilterUI();
    }

    renderJobs(jobs);

  } catch (error) {
    console.error("Error fetching job data:", error);
  }
});