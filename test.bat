$folder = 'C:\Users\galico user\Documents\batscripts\test'  # replace with the path of your directory
$filter = '*.*'  # monitors all file types

$fsw = New-Object IO.FileSystemWatcher $folder, $filter -Property @{
    IncludeSubdirectories = $true
    NotifyFilter = [IO.NotifyFilters]'FileName, LastWrite'
}

$Action = {
    $details = $Event.SourceEventArgs
    $name = $details.Name
    $changeType = $details.ChangeType
    if($changeType -eq 'Deleted'){
        [System.Windows.MessageBox]::Show("$name has been deleted from $folder", 'Warning', 'OK', 'Warning')
    }
}

Register-ObjectEvent $fsw 'Deleted' -SourceIdentifier FileDeleted -Action $Action

# To keep the script running.
while ($true) {
    Start-Sleep -Seconds 10
}
