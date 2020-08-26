import * as core from '@actions/core';
import { spawn } from 'child_process';
import * as setupGcloud from '../../setupGcloudSDK/dist/index';

/**
 * Executes the main action. It includes the main business logic and is the
 * primary entry point. It is documented inline.
 */
async function run(): Promise<void> {
  try {
    // Retrieve input.
    const instanceConnectionName = core.getInput('instance_connection_name');
    const port = core.getInput('port');
    const credentials = core.getInput('credentials');

    // Install gcloud if not already installed.
    if (!setupGcloud.isInstalled()) {
      const gcloudVersion = await setupGcloud.getLatestGcloudSDKVersion();
      await setupGcloud.installGcloudSDK(gcloudVersion);
    }

    // Authenticate gcloud SDK.
    if (credentials) {
      await setupGcloud.authenticateGcloudSDK(credentials);
    }

    const authenticated = await setupGcloud.isAuthenticated();
    if (!authenticated) {
      core.setFailed('Error authenticating the Cloud SDK.');
    }

    console.log(process.cwd());

    const child = spawn(
      './cloud_sql_proxy',
      [`-instances=${instanceConnectionName}=tcp:${port}`],
      {
        detached: true,
        stdio: 'inherit',
      },
    );
    child.unref();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
