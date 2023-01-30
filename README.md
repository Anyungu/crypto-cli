# CLI program to convert crypto tokens transacted to USD values


## Flow Diagram

![Flow](docs/images/propine.drawio.png)

## Tech stack used
|Technology| Reason |
|---|---|
|Typescript| Easier debugging due to presence of types|
|Axios| Node 16 lackes the experimental fetch feature. Easier option |
|Dotenv| Environment management of the crypto compare API key|
|yargs| Ability to add options in the command line tool created|
|csv-parse| Easier streaming of chunked data from the file into clear objects|

## Setting up and running the project

Requirements, Node 16

1. clone the project
> `git clone git@github.com:Anyungu/crypto-cli.git`

2. In the root of the project, create a folder called files and add the transactions.csv file into the folder.

3. In the root folder of the project, install all the  required packages
> `npm install`

4. Compile the project
> `npm run build`

5. Install the project globally by running the following command in the root folder of the project
> `npm install -g .`

6. To uninstall
> `npm uninstall -g .`

7. Test the cli command by running
> `dollar`

8. To add optional token and date
> `dollar -d <YYYY/MM/DD> -t <token>`

## File streaming
Owing to the large size of the file, a streaming strategy is favourable.
The csv data is continuousl parsed and filtered based on the token and the date options provided by the cli.

If no date/token is provided, this filter is ignored.

## Assumptions made
1. Only a single token can be added to the command line tool. Ideally we should have abilities to handle multiple tokens and date ranges as opposed to a single token and a single date.
2. Users will use the tool responsibly to avoid overwhelming the crypto compare APIs.