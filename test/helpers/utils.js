const Utils = imports.src.helpers.utils;

function testSuite() {
	describe('urlAppend', function() {
		it('should append a URI to a domain not ending on /', function() {
			expect(Utils.urlAppend('http://www.example.com', 'path/to/something')).toBe('http://www.example.com/path/to/something');
		});

		it('should append a URI to a domain ending on /', function() {
			expect(Utils.urlAppend('http://www.example.com/', 'path/to/something')).toBe('http://www.example.com/path/to/something');
		});
	});

	describe('jobMaches', function() {

		var testPatterns = [
			'testJob',
			'.*testJob',
			'testJob.*',
			'.*testJob.*',
			'.*test.*'
		];

		it('should match positive patterns', function() {
			var job = {
				name: 'testJob'
			};

			// try to match all test patterns
			for( var index = 0 ; index < testPatterns.length ; ++index ) {
				expect(Utils.jobMatches(job, [testPatterns[index]])).toBe(true);
			}
		});

		it('should not match negative patterns', function() {
			var job = {
				name: 'testJob'
			};

			// try to not match all negative test patterns
			for( var index = 0 ; index < testPatterns.length ; ++index ) {
				expect(Utils.jobMatches(job, ['!' + testPatterns[index]])).toBe(false);
			}

			expect(Utils.jobMatches(job, ['anotherJob'])).toBe(false);
		});
	});

	describe('jobStates::getRank', function() {
		it('should consider failed jobs with highest rank', function() {
			expect(Utils.jobStates.getRank('red_anime')).toBe(0);
		});
	});

	describe('jobStates::getIcon', function() {
		it('should return a blue icon for blue jobs if green balls are switched off', function() {
			expect(Utils.jobStates.getIcon('blue', false)).toBe('jenkins_blue');
		});

		it('should return a green icon for blue jobs if green balls are switched off', function() {
			expect(Utils.jobStates.getIcon('blue', true)).toBe('jenkins_green');
		});

		it('should return a gray icon for unknown jobs', function() {
			expect(Utils.jobStates.getIcon('someWeirdJobState', true)).toBe('jenkins_grey');
		});
	});

	describe('jobStates::getFilter', function() {
		it('should be able to get a filter for running jobs', function() {
			expect(Utils.jobStates.getFilter('red_anime')).toBe('show_running_jobs');
			expect(Utils.jobStates.getFilter('yellow_anime')).toBe('show_running_jobs');
			expect(Utils.jobStates.getFilter('blue_anime')).toBe('show_running_jobs');
			expect(Utils.jobStates.getFilter('grey_anime')).toBe('show_running_jobs');
			expect(Utils.jobStates.getFilter('aborted_anime')).toBe('show_running_jobs');
		});

		it('should return the filter for disabled jobs for unknown job states', function() {
			expect(Utils.jobStates.getFilter('someWeirdJobState')).toBe('show_disabled_jobs');
		});
	});

	describe('jobStates::getName', function() {
		it('should consider weirdly setup job names as unknown', function() {
			expect(Utils.jobStates.getName('someWeirdJobState')).toBe('unknown');
		});
	});

	describe('jobStates::getDefaultState', function() {
		it('should be disabled', function() {
			expect(Utils.jobStates.getDefaultState()).toBe('disabled');
		});
	});

	describe('jobStates::getErrorState', function() {
		it('should be red', function() {
			expect(Utils.jobStates.getErrorState()).toBe('red');
		});
	});
}
