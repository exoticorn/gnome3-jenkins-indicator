// append a uri to a domain regardless whether domains ends with '/' or not
function urlAppend(domain, uri)
{
	if( domain.length>=1 )
		return domain + (domain.charAt(domain.length-1)!='/' ? '/' : '') + uri;
	else
		return uri;
}

// call operation on all elements of array2 which are not in array1 using a compare function
function arrayOpCompare(array1, array2, compare_func, operation_func)
{
	for( var i=0 ; i<array1.length ; ++i )
	{
		let found_in_array2 = false;
		for( var j=0 ; j<array2.length ; ++j )
		{
			if( compare_func(array1[i], array2[j]) )
				found_in_array2 = true;
		}

		if( !found_in_array2 )
			operation_func(i, array1[i]);
	}
}

// return if a job matches a list of patterns ('!' char negates a pattern)
function jobMatches(job, patterns){
	var patternsLength = patterns.length;
	for (var i = 0; i < patternsLength; i++) {
		var pattern = patterns[i];
		var positive_search = true;
		if (pattern.indexOf("!") == 0) {
			positive_search = false;
			pattern = pattern.substring(1);
		}
		// if matches the apttern and we are looking for matches
		if(job.name.match(pattern) && positive_search) {
			return true;
		// if it does not match the pattern and we are looking for not matches
		} else if (!job.name.match(pattern) && !positive_search) {
			return true;
		}
	}
	// if it did not match any pattern
	return false
}

// returns icons and state ranks for job states
const jobStates = new function() {
	// define job states (colors) and their corresponding icon, feel free to add more here
	// this array is also used to determine the rank of a job state, low array index refers to a high rank
	// filter refers to the name of the filter setting (whether to show matching jobs or not)
	// name is used for notifications about job changes
	let states = [
		{ color: 'red_anime',     icon: 'clock',  filter: 'show_running_jobs',    name: 'running' },
		{ color: 'yellow_anime',  icon: 'clock',  filter: 'show_running_jobs',    name: 'running' },
		{ color: 'blue_anime',    icon: 'clock',  filter: 'show_running_jobs',    name: 'running' },
		{ color: 'grey_anime',    icon: 'clock',  filter: 'show_running_jobs',    name: 'running' },
		{ color: 'aborted_anime', icon: 'clock',  filter: 'show_running_jobs',    name: 'running' },
		{ color: 'red',           icon: 'red',    filter: 'show_failed_jobs',     name: 'failed' },
		{ color: 'yellow',        icon: 'yellow', filter: 'show_unstable_jobs',   name: 'unstable' },
		{ color: 'blue',          icon: 'blue',   filter: 'show_successful_jobs', name: 'successful' },
		{ color: 'green',         icon: 'blue',   filter: 'show_successful_jobs', name: 'successful' },
		{ color: 'grey',          icon: 'grey',   filter: 'show_neverbuilt_jobs', name: 'never built' },
		{ color: 'notbuilt',      icon: 'grey',   filter: 'show_notbuilt_jobs',   name: 'notbuilt' },
		{ color: 'aborted',       icon: 'grey',   filter: 'show_aborted_jobs',    name: 'aborted' },
		{ color: 'disabled',      icon: 'grey',   filter: 'show_disabled_jobs',   name: 'disabled' }
	];

	// returns the rank of a job state, highest rank is 0, -1 means that the job state is unknown
	// this is used to determine the state of the overall indicator which shows the state of the highest ranked job
	this.getRank = function(job_color)
	{
		for( let i=0 ; i<states.length ; ++i )
		{
			if( job_color==states[i].color ) return i;
		}
		return -1;
	};

	// returns the corresponding icon name of a job state
	this.getIcon = function(job_color, with_green_balls)
	{
		for( let i=0 ; i<states.length ; ++i )
		{
			// use green balls plugin if actived
			if( with_green_balls && job_color=='blue' ) return 'jenkins_green';

			// if not just return a regular icon
			else if( job_color==states[i].color ) return 'jenkins_' + states[i].icon;
		}
		// if job color is unknown, use the grey icon
		return 'jenkins_grey';
	};

	// returns the corresponding icon name of a job state
	this.getFilter = function(job_color)
	{
		for( let i=0 ; i<states.length ; ++i )
		{
			if( job_color==states[i].color ) return states[i].filter;
		}
		// if job color is unknown, use the filter setting for disabled jobs
		return 'show_disabled_jobs';
	};

	// returns the corresponding icon name of a job state
	this.getName = function(job_color)
	{
		for( let i=0 ; i<states.length ; ++i )
		{
			if( job_color==states[i].color ) return _(states[i].name);
		}
		// if job color is unknown, use the filter setting for disabled jobs
		return 'unknown';
	};

	// returns the default job state to use for overall indicator
	this.getDefaultState = function()
	{
		// return lowest ranked job state
		return states[states.length-1].color;
	};

	// return the color of the error state for the overall indicator
	this.getErrorState = function()
	{
		return "red";
	};
};
