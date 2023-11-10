# home-trading-system



### Prerequisites

To run the project you will need to have the following installed:

* Net Framework 7 (https://dotnet.microsoft.com/en-us/download/dotnet/7.0)
* Node v16.20.0 or higher (https://nodejs.org/en/blog/release/v16.20.0)
* Visual Studio Code IDE (Yes not your own!)

### Setup

First, `cd client`

Then run commands `npm install` `npm run-script build`

Go back to the main directory `cd ..`



To run the this application mate, there are two ways of doing so.

#### Running the front-end only

To run the front end only, make sure the prerequisites are installed.

It is recommend mate, that you run the full application instead of the front end only.

Go to `cd client`, then run `npm run-script start`

#### Running tests

To run tests, run `npm run-script jest`

To create and run test files, it must reside in the test folder `cd client/src/main/test`

All unit tests in react use jest, some libraries however are not compatible with jest and 
should be ignored by setting `transformIgnorePatterns` in `package.json`

#### Run the full application (front-end and back-end)

##### Use the debugger

Navigate to run and debug, hit `start debugging`



#### Changing ports

If the ports set in this application conflict with any ports running locally on your machine, 
it is possible to change them.

Open `Program.cs` and change the port numbers on `WebHostBuilder().UseUrls`

Open `client/package.json` and change the proxy to the corrosponding port number

Run `npm run-script build`

Go back to the main directory `cd ..`

Run `dotnet clean StockScreener.csproj` and `dotnet build StockScreener.csproj`


