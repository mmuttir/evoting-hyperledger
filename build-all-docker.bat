@echo off

setlocal

call :build_image "peer0_events" "k8s/images/peer0_events/Dockerfile"
call :build_image "peer1_events" "k8s/images/peer1_events/Dockerfile"

call :build_image "peer0_promotion" "k8s/images/peer0_promotion/Dockerfile"
call :build_image "peer1_promotion" "k8s/images/peer1_promotion/Dockerfile"

call :build_image "peer0_registeration" "k8s/images/peer0_registeration/Dockerfile"
call :build_image "peer1_registeration" "k8s/images/peer1_registeration/Dockerfile"

call :build_image "peer0_sports" "k8s/images/peer0_sports/Dockerfile"
call :build_image "peer1_sports" "k8s/images/peer1_sports/Dockerfile"

call :build_image "peer0_sportsfemale" "k8s/images/peer0_sportsfemale/Dockerfile"
call :build_image "peer1_sportsfemale" "k8s/images/peer1_sportsfemale/Dockerfile"

goto :eof

:build_image
    set tag=%~1
    set dockerfile=%~2

    echo Building %tag% image
    start /B cmd /C "docker build -t %tag% -f %dockerfile% . >NUL 2>&1 || echo Failed to build %tag% image"
    echo %tag% image build started in the background
    goto :eof
