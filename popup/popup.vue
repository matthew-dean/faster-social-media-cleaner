
<section>
    <p>Select a range to delete/hide posts from your Facebook history.</p>
    <p class="has-text-danger">Warning: Deletions are permanent! Make a backup of your data first!</p>
    <div class="box container is-fluid">
      <div class="field">
        <label for=from>From</label>
        <div class="control">
          <input type="date" class="datepicker" id="from" v-model="from">
        </div>
      </div>

      <div class="field">
        <label for=to>To</label>
        <div class="control">
          <input type="date" class="datepicker" id="to" v-model="to">
        </div>
      </div>

      <div id="clean">
        <p class="is-size-7 has-text-grey">Not all activity can be deleted. 
          In those cases, this action will hide the activity from your Timeline.</p>
        
        <div id="progress" v-if="started">
          <p id="progressMessage" class="is-size-6">{{ deleting ? 'Deleting...' : 'Loading...' }}{{ results }}</p>
          <progress id="progressBar" class="progress is-primary is-small" :value="progress" max="100"></progress>
          <a class="button is-primary" @click="cancelAction">Cancel</a>
        </div>
        
        <div id="commit" v-else>
          <div class="field">
            <label class="checkbox">
              <input type="checkbox" id="agree" v-model="agree">
              Yes, I know what I'm doing.
            </label>
          </div>
            
          <a class="button is-danger" :disabled="!agree" @click="deleteAction">Delete</a>
        </div>

        <p class="is-size-7 has-text-danger" id="error" v-if="error">There was an error. Try refreshing your Facebook page.</p>
      </div>
    </div>
  </section>