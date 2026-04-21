package main

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/ok-yyyy/discord-util-bot/app/internal/app"
)

const shutdownTimeout = 10 * time.Second

func init() {
	slog.SetDefault(slog.New(slog.NewJSONHandler(os.Stderr, nil)))
}

func main() {
	slog.Info("application starting")

	if err := run(context.Background()); err != nil {
		slog.Error("fatal error", slog.Any("err", err))
		os.Exit(1)
	}

	slog.Info("application exited")
}

func run(ctx context.Context) error {
	ctx, stop := signal.NotifyContext(ctx, os.Interrupt, syscall.SIGTERM)
	defer stop()

	cfg, err := app.NewConfig()
	if err != nil {
		return fmt.Errorf("load config: %w", err)
	}

	application, err := app.New(cfg)
	if err != nil {
		return fmt.Errorf("create app: %w", err)
	}

	if err := application.RegisterCommands(); err != nil {
		return fmt.Errorf("register commands: %w", err)
	}
	slog.Info("application command registered")

	if err := application.Start(ctx); err != nil {
		return fmt.Errorf("start app: %w", err)
	}

	slog.Info("bot is running")

	<-ctx.Done()

	slog.Info("shutting down bot")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), shutdownTimeout)
	defer cancel()

	application.Close(shutdownCtx)

	return nil
}
