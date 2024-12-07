# discord-bot
# discord-bot

## Introduction
This tutorial will guide you through the process of setting up and running a Discord bot using Python. By the end of this tutorial, you will have a fully functional bot that can respond to commands in a Discord server.

## Prerequisites
Before you begin, make sure you have the following:
- A Discord account
- A Discord server where you have permission to add a bot
- Python 3.6 or higher installed on your computer
- Basic knowledge of Python programming

## Step 1: Create a Discord Application
1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click on the "New Application" button.
3. Enter a name for your application and click "Create".
4. In the left sidebar, click on "Bot".
5. Click the "Add Bot" button and confirm by clicking "Yes, do it!".

## Step 2: Get Your Bot Token
1. In the "Bot" section of your application, you will see a "Token" section.
2. Click on the "Copy" button to copy your bot token. Keep this token safe and do not share it with anyone.

## Step 3: Invite Your Bot to Your Server
1. In the "OAuth2" section of your application, click on "URL Generator".
2. Under "OAuth2 URL Generator", select the "bot" scope.
3. Under "Bot Permissions", select the permissions you want your bot to have.
4. Copy the generated URL and paste it into your browser.
5. Select the server where you want to add the bot and click "Authorize".

## Step 4: Set Up Your Development Environment
1. Create a new directory for your bot project.
2. Open a terminal and navigate to your project directory.
3. Create a virtual environment by running:
   ```
   python -m venv venv
   ```
4. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS and Linux:
     ```
     source venv/bin/activate
     ```
5. Install the `discord.py` library by running:
   ```
   pip install discord.py
   ```

## Step 5: Create Your Bot Script
1. In your project directory, create a new file named `bot.py`.
2. Open `bot.py` in your favorite text editor and add the following code:
   ```python
   import discord
   from discord.ext import commands

   # Replace 'YOUR_BOT_TOKEN' with your actual bot token
   TOKEN = 'YOUR_BOT_TOKEN'

   bot = commands.Bot(command_prefix='!')

   @bot.event
   async def on_ready():
       print(f'Logged in as {bot.user.name} ({bot.user.id})')

   @bot.command()
   async def hello(ctx):
       await ctx.send('Hello!')

   bot.run(TOKEN)
   ```

## Step 6: Run Your Bot
1. In the terminal, make sure your virtual environment is activated.
2. Run your bot script by executing:
   ```
   python bot.py
   ```
3. You should see a message in the terminal indicating that your bot has logged in.

## Step 7: Test Your Bot
1. Go to your Discord server and type `!hello` in a text channel.
2. Your bot should respond with "Hello!".

Congratulations! You have successfully created and run a Discord bot. You can now start adding more commands and features to your bot.

## Additional Resources
- [discord.py Documentation](https://discordpy.readthedocs.io/en/stable/)
- [Discord Developer Portal](https://discord.com/developers/applications)
- [Python Documentation](https://docs.python.org/3/)