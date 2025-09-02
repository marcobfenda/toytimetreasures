#!/bin/bash

# Playwright Test Runner Script for Online Shop
# This script provides easy commands to run different types of tests

echo "🎭 Playwright Test Runner for Online Shop"
echo "=========================================="

# Function to check if required services are running
check_services() {
    echo "🔍 Checking required services..."
    
    # Check if frontend is running
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Frontend is running on http://localhost:3000"
    else
        echo "❌ Frontend is not running on http://localhost:3000"
        echo "   Please start the frontend with: npm run dev"
        exit 1
    fi
    
    # Check if backend is running
    if curl -s http://localhost:8000/api > /dev/null 2>&1; then
        echo "✅ Backend API is running on http://localhost:8000"
    else
        echo "❌ Backend API is not running on http://localhost:8000"
        echo "   Please start the backend with Docker Compose"
        exit 1
    fi
    
    echo ""
}

# Function to run all tests
run_all_tests() {
    echo "🚀 Running all tests..."
    npm run test
}

# Function to run tests with UI
run_tests_ui() {
    echo "🖥️  Running tests with UI mode..."
    npm run test:ui
}

# Function to run tests in headed mode
run_tests_headed() {
    echo "👁️  Running tests in headed mode..."
    npm run test:headed
}

# Function to run tests in debug mode
run_tests_debug() {
    echo "🐛 Running tests in debug mode..."
    npm run test:debug
}

# Function to run specific test file
run_specific_test() {
    local test_file=$1
    echo "🎯 Running specific test: $test_file"
    npx playwright test "$test_file"
}

# Function to run tests for specific browser
run_browser_tests() {
    local browser=$1
    echo "🌐 Running tests in $browser..."
    npx playwright test --project="$browser"
}

# Function to show test report
show_report() {
    echo "📊 Opening test report..."
    npm run test:report
}

# Function to install/update Playwright
install_playwright() {
    echo "📦 Installing/updating Playwright..."
    npx playwright install --with-deps
}

# Function to show help
show_help() {
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  all                    Run all tests"
    echo "  ui                     Run tests with UI mode"
    echo "  headed                 Run tests in headed mode"
    echo "  debug                  Run tests in debug mode"
    echo "  specific <file>        Run specific test file"
    echo "  browser <browser>      Run tests in specific browser"
    echo "  report                 Show test report"
    echo "  install                Install/update Playwright"
    echo "  help                   Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 all"
    echo "  $0 specific navigation.spec.js"
    echo "  $0 browser chromium"
    echo "  $0 ui"
    echo ""
    echo "Available browsers:"
    echo "  - chromium"
    echo "  - firefox"
    echo "  - webkit"
    echo "  - 'Mobile Chrome'"
    echo "  - 'Mobile Safari'"
}

# Main script logic
case "$1" in
    "all")
        check_services
        run_all_tests
        ;;
    "ui")
        check_services
        run_tests_ui
        ;;
    "headed")
        check_services
        run_tests_headed
        ;;
    "debug")
        check_services
        run_tests_debug
        ;;
    "specific")
        if [ -z "$2" ]; then
            echo "❌ Please specify a test file"
            echo "   Usage: $0 specific <test-file>"
            exit 1
        fi
        check_services
        run_specific_test "$2"
        ;;
    "browser")
        if [ -z "$2" ]; then
            echo "❌ Please specify a browser"
            echo "   Usage: $0 browser <browser-name>"
            exit 1
        fi
        check_services
        run_browser_tests "$2"
        ;;
    "report")
        show_report
        ;;
    "install")
        install_playwright
        ;;
    "help"|"--help"|"-h"|"")
        show_help
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo "   Use '$0 help' to see available commands"
        exit 1
        ;;
esac
