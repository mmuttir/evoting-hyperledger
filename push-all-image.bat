@echo off

setlocal
call :build_image "orderer"

call :build_image "peer0_events"
call :build_image "peer1_events"

call :build_image "peer0_promotion"
call :build_image "peer1_promotion"

call :build_image "peer0_registeration"
call :build_image "peer1_registeration"

call :build_image "peer0_sports"
call :build_image "peer1_sports"

call :build_image "peer0_sportsfemale"
call :build_image "peer1_sportsfemale"

goto :eof

:build_image
    set tag=%~1

    echo Pushing %tag% image
    docker push mutti11/%tag%
    goto :eof
