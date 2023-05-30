# Crawler Project

The crawler project designed to retrieve data from a third-party website that lists top Minecraft servers. The retrieved data includes the server's name, image, tags, version, slots, and whether it is cracked or premium. The project utilizes Docker Compose to launch the components, including the database, website, and crawler, as containers. By following a few simple steps outlined below, you can easily set up and run the project.

## Table of Contents

- [Project Description](#project-description)
- [Installation](#installation)
- [Usage](#usage)
- [Accessing the Website](#accessing-the-website)
- [Filtering](#filtering)

## Project Description

The crawler project aims to scrape data from a third-party website that curates a list of top Minecraft servers. By running the crawler, you can retrieve essential information about each server, such as its name, image, tags, version, slots, and whether it is cracked or premium. This data is then displayed on a website, allowing users to explore and search for servers based on various criteria.

## Installation

To set up the project, please follow these installation steps:

1. Clone the project repository to your local machine.
2. Install Docker Compose if you haven't already.
3. Open a terminal or command prompt and navigate to the project's root directory.

## Usage

Once you have completed the installation, follow these steps to run the project:

1. In the terminal or command prompt, ensure that you are in the project's root directory.
2. Run the following command: `docker-compose up --build`
   - This command will build and launch the necessary containers, including the database, website, and crawler.
   - The build process may take some time depending on your system and internet connection.

## Accessing the Website

After successfully launching the project, you can access the website by following these instructions:

1. Open a web browser of your choice.
2. In the address bar, enter `localhost:8080`.
   - This will direct you to the locally hosted website.

## Filtering

The website provides a filtering functionality that allows you to refine your search based on the server's name, tags, or slots. To utilize the filtering feature, follow these steps:

1. Once you have accessed the website using the steps mentioned above, you will be presented with a list of Minecraft servers.
2. Locate the filtering options provided on the website.
3. Enter your desired criteria in the respective fields (e.g., name, tags, slots).
4. Click the filter button or submit the form to apply the filters.
   - The website will update the server list to display only the servers that match the specified criteria.

Feel free to explore the listed Minecraft servers and enjoy discovering new ones that match your preferences!

If you encounter any issues during the installation or usage of the project, please refer to the project documentation or reach out to the project maintainer for further assistance.

Happy Minecraft server exploration!
