import './css/styles.css';
import { debounce } from 'lodash';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

const search = document.querySelector('#search-box');
const countriesList = document.querySelector('.country-list');
const countryDetails = document.querySelector('.country-info');

search.addEventListener('input', debounce(searchCountries, DEBOUNCE_DELAY));

function searchCountries(event) {
  const inputText = event.target.value.trim();

  if (!inputText) {
    clearCountries();
    return;
  }

  fetchCountries(inputText)
    .then(countries => {
      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      renderCountriesList(countries);
    })
    .catch(error => {
      clearCountries();
      switch (error.message) {
        case '404':
          Notify.failure('Oops, there is no country with that name');
          break;
      }
    });
}

function clearCountries() {
  countriesList.innerHTML = '';
  countryDetails.innerHTML = '';
}

function renderCountriesList(countries) {
  console.log(countries.length);
  if (countries.length == 1) {
    createCountryDetails(countries);
  } else {
    createCountriesList(countries);
  }
}

function createCountriesList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `
          <li class="country-item">
          <img class="country-flag" src = ${flags.svg} alt="${name} flag"/>
          <p class="country-name">${name.common}</p>
          </li>`;
    })
    .join('');
  countriesList.innerHTML = markup;
}

function createCountryDetails(countries) {
  const markup = countries
    .map(({ name, capital, population, languages, flags }) => {
      return `
        <div class="country-title">
          <img class="country-flag" src = ${flags.svg} alt="${name} flag"/>
          <p class="country-name">${name.common}</p>
        </div>
        <p class="country-detail"><b>Calpital: </b>${capital}</p>
        <p class="country-detail"><b>Population: </b>${population}</p>
        <p class="country-detail"><b>Languages: </b>${Object.values(
          languages
        )}</p>
         `;
    })
    .join('');
  countryDetails.innerHTML = markup;
}
