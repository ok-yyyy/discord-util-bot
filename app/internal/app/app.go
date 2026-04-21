package app

import (
	"context"
	"fmt"

	"github.com/disgoorg/disgo/bot"
	"github.com/ok-yyyy/discord-util-bot/app/internal/discordbot"
	"github.com/ok-yyyy/discord-util-bot/app/internal/discordbot/commands"
)

type App struct {
	client *bot.Client
	cmds   []discordbot.Command
}

func New(cfg Config) (*App, error) {
	cmds := commandList()
	router := discordbot.NewRouter(cmds)

	client, err := discordbot.NewClient(cfg.BotToken, router)
	if err != nil {
		return nil, fmt.Errorf("create discord client: %w", err)
	}

	return &App{
		client: client,
		cmds:   cmds,
	}, nil
}

func (a *App) RegisterCommands() error {
	if err := discordbot.RegisterGlobalCommands(a.client, a.cmds); err != nil {
		return fmt.Errorf("register global commands: %w", err)
	}

	return nil
}

func (a *App) Start(ctx context.Context) error {
	if err := a.client.OpenGateway(ctx); err != nil {
		return fmt.Errorf("open discord client: %w", err)
	}

	return nil
}

func (a *App) Close(ctx context.Context) {
	a.client.Close(ctx)
}

func commandList() []discordbot.Command {
	return []discordbot.Command{
		commands.NewPing(),
	}
}
