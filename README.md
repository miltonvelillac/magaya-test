# Rick and Morty
* To run the project, run npm i, then run npm start
* The project runs in http://localhost:4200/

The project has 4 pages
locations, dimensions, episodes, character

locations -> search page -> the user can add a location name in the input and hits the button or press the enter key, then the UI will call 2 APIs
1. https://rickandmortyapi.com/api/location/?location=C-137 C-137 is a location name example
2. The UI gets all the characters Ids
3. Then it calls the API https://rickandmortyapi.com/api/character/ids, the number of the ids depend of selected items per page, it means, if the Items per page are 10 the UI will call the API with 10 ids
4. When the user navigates through the pagination theN I will call the API to get and store the characters
5. NOTE: If the UI checks that a character ID already exists in the store, it will not be included in the API call because there is no need to request existing data from the backend again since this data does not change frequently
6. If the user hits on of the character rows the UI will redirect the user to the character page (in this case the UI won't call the API to get the character data again because it already exists, but if the user reload the page, the UI will call the API to get the character data)

dimensions -> search page -> The flow is the same as location, the only change is that the user searches by a dimension name.

episodes -> search page ->The flow is pretty much the same as location, the only changes are that the user searches by episode name and the UI won't call the location API, instead it will call the episode API https://rickandmortyapi.com/api/episode?name=Pilo, the rest of the flow is the same.


character -> detail page -> 
1. the UI calls the API https://rickandmortyapi.com/api/character/id if the character is not in the store, in other case the UI only gets the character from the store
2. The UI calls the API https://rickandmortyapi.com/api/location/id to get the dimension name if the dimension is not in the store
3. To load the dimension name the UI uses a different spinner this means that the UI shows the character data on the screen while the dimension name is still loading

# Architecture
2 Architectures have been used
* Modular Architecture: The project has been dived in core, features, shared
* Atomic design: here in shared -> ui path is applied this design pattern, using atoms, molecules and organisms to abstract the components and make them reusable and easier to modify

# Design Patterns
* The Redux design pattern has been applied using NGRX with the signals implementation (https://ngrx.io/guide/signals/signal-store)
* * NOTE: Take into account that the signals implementation is simpler so you won't see effects or selectors, because this implementation doesn't use those concepts
* The Adapter design pattern has been use to map all the data that the api service receive and return (request and response), this can be checked in core\mappers
* The statefull and staless components design pattern has been applied using Atomic Design
* The BEM design pattern for CSS has been applied
* The Dry principle has been applied, so you would see some providers sharing methods in order to avoid to repeat logic
* All the visual text is in the text.constant.ts file, this helps to apply and reuse values easier, also if the project needs to apply internationalization

# Unit Testing
* To run the unit testing -> run npm test

All the test files are working but only some of them have unit test due to the time
I applied unit tests on different types of files to show you how I work on each different type of file.
NOTE: The AAA pattern for unit testing has been applied.

Check:
input-text.component.spec.ts
characters-reducer.spec.ts
characters-handler.store.spec.ts
characters.mapper.spec.ts
rick-and-morty.api.service.spec.ts
character.component.spec.ts

* NOTE: The Application works for different screen resolutions, it also works fine for mobile or tablet devices.
* NOTE: The Application has been deployed using github pages, you can see it in https://miltonvelillac.github.io/rick-and-morty
* NOTE: There are 3 search screens (Locations, Dimensions, and Episodes), it could have been just one with 3 search entries, but I did it this way to show you how I handle reuse of components and logic, also the challenge requirement specified that there must be 3 pages.

