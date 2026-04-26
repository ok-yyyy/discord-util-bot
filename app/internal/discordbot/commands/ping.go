package commands

import (
	"log/slog"

	"github.com/disgoorg/disgo/discord"
	"github.com/disgoorg/disgo/handler"
	"github.com/ok-yyyy/discord-util-bot/app/internal/discordbot"
)

// Ping コマンドは、疎通確認のためのコマンドです。
type Ping struct{}

var _ discordbot.Command = (*Ping)(nil)

func NewPing() *Ping {
	return &Ping{}
}

func (c *Ping) Definition() discord.ApplicationCommandCreate {
	return discord.SlashCommandCreate{
		Name:        "ping",
		Description: "疎通確認",
		IntegrationTypes: []discord.ApplicationIntegrationType{
			discord.ApplicationIntegrationTypeGuildInstall,
			discord.ApplicationIntegrationTypeUserInstall,
		},
		Contexts: []discord.InteractionContextType{
			discord.InteractionContextTypeGuild,
			discord.InteractionContextTypeBotDM,
			discord.InteractionContextTypePrivateChannel,
		},
	}
}

func (c *Ping) Handle(e *handler.CommandEvent) error {
	user := e.User()
	slog.Info(
		"command executed",
		slog.String("command", "ping"),
		slog.String("id", user.ID.String()),
		slog.String("username", user.Username),
	)

	return e.CreateMessage(
		discord.NewMessageCreate().
			WithEphemeral(true).
			WithContent("pong"),
	)
}
