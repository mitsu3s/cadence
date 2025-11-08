package logger

import (
	"os"
	"strconv"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// InitZap initializes a global zap logger that logs to stdout only
func InitZap() error {
	debugMode, _ := strconv.ParseBool(os.Getenv("DEBUG_MODE"))

	format := os.Getenv("LOG_FORMAT")
	if format == "" {
		format = "console"
	}

	level := zapcore.InfoLevel
	if debugMode {
		level = zapcore.DebugLevel
	}

	var encoder zapcore.Encoder
	switch format {
	case "json":
		encoder = zapcore.NewJSONEncoder(encoderConfig(false))
	default:
		encoder = zapcore.NewConsoleEncoder(encoderConfig(true))
	}

	core := zapcore.NewCore(
		encoder,
		zapcore.AddSync(os.Stdout),
		level,
	)

	logger := zap.New(core)
	zap.ReplaceGlobals(logger)

	return nil
}

func encoderConfig(isConsole bool) zapcore.EncoderConfig {
	cfg := zap.NewProductionEncoderConfig()

	cfg.MessageKey = "msg"
	cfg.LevelKey = "level"
	cfg.NameKey = "name"
	cfg.TimeKey = "timestamp"
	cfg.CallerKey = "caller"
	cfg.FunctionKey = "func"
	cfg.StacktraceKey = "stacktrace"
	cfg.LineEnding = "\n"
	cfg.ConsoleSeparator = "    "
	cfg.EncodeTime = map[bool]zapcore.TimeEncoder{true: zapcore.ISO8601TimeEncoder, false: zapcore.EpochTimeEncoder}[isConsole]
	cfg.EncodeLevel = map[bool]zapcore.LevelEncoder{true: zapcore.CapitalColorLevelEncoder, false: zapcore.LowercaseLevelEncoder}[isConsole]
	cfg.EncodeDuration = zapcore.SecondsDurationEncoder
	cfg.EncodeCaller = zapcore.ShortCallerEncoder

	return cfg
}

// LogDebug outputs log with DEBUG LEVEL.
// The arguments kv... are key-value pairs of additional information.
func LogDebug(msg string, kv ...interface{}) {
	zap.S().Debugw(msg, kv...)
}

// LogInfo outputs log with INFO LEVEL.
// The arguments kv... are key-value pairs of additional information.
func LogInfo(msg string, kv ...interface{}) {
	zap.S().Infow(msg, kv...)
}

// LogErr outputs log with ERROR LEVEL.
// The arguments kv... are key-value pairs of additional information.
func LogErr(msg string, kv ...interface{}) {
	zap.S().Errorw(msg, kv...)
}
