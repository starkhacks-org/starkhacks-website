<script>
	import faqStyles from '../styles/faq.module.css';
	import faqData from '../data/faq.json';
	import { onMount } from 'svelte';

	/** @type {number | null} */
	let expandedGeneral = null;
	/** @type {number | null} */
	let expandedRegistration = null;
	/** @type {number | null} */
	let expandedMiscellaneous = null;

	/**
	 * @param {'general' | 'registration' | 'miscellaneous'} category
	 * @param {number} index
	 * @param {MouseEvent} event
	 */
	function toggleQuestion(category, index, event) {
		// Get the button that was clicked
		const button = event.currentTarget;
		if (!button || !(button instanceof HTMLButtonElement)) return;
		
		// Find the answer container (next sibling after button)
		const answerContainer = button.nextElementSibling;
		if (!answerContainer || !(answerContainer instanceof HTMLElement)) return;
		
		// Get all answer containers in the same category box
		const box = button.closest(`.${faqStyles.box}`);
		if (!box || !(box instanceof HTMLElement)) return;
		
		const allAnswers = box.querySelectorAll(`.${faqStyles.answerContainer}`);
		
		// Check if this question is currently expanded
		const isCurrentlyExpanded = answerContainer.classList.contains('expanded');
		
		// Collapse all answers in this box first
		allAnswers.forEach((/** @type {Element} */ answer) => {
			if (answer instanceof HTMLElement) {
				answer.classList.remove('expanded');
				answer.style.maxHeight = '0';
				answer.style.padding = '0';
				answer.style.opacity = '0';
			}
		});
		
		// If it wasn't expanded, expand it now
		if (!isCurrentlyExpanded) {
			answerContainer.classList.add('expanded');
			// Get the actual height of the content
			const answerText = answerContainer.querySelector(`.${faqStyles.answerText}`);
			if (answerText instanceof HTMLElement) {
				const height = answerText.scrollHeight;
				// Use smaller padding on mobile
				const isMobile = window.innerWidth <= 768;
				const padding = isMobile ? 6 : 24;
				const paddingTop = isMobile ? '2px' : '8px';
				const paddingBottom = isMobile ? '4px' : '16px';
				answerContainer.style.maxHeight = `${height + padding}px`;
				answerContainer.style.padding = `${paddingTop} 0 ${paddingBottom}`;
				answerContainer.style.opacity = '1';
			}
		}
		
		// Update state for reactivity
		if (category === 'general') {
			expandedGeneral = isCurrentlyExpanded ? null : index;
		} else if (category === 'registration') {
			expandedRegistration = isCurrentlyExpanded ? null : index;
		} else if (category === 'miscellaneous') {
			expandedMiscellaneous = isCurrentlyExpanded ? null : index;
		}
	}

	/**
	 * @param {'general' | 'registration' | 'miscellaneous'} category
	 * @param {number} index
	 * @returns {boolean}
	 */
	function isExpanded(category, index) {
		if (category === 'general') {
			return expandedGeneral === index;
		} else if (category === 'registration') {
			return expandedRegistration === index;
		} else if (category === 'miscellaneous') {
			return expandedMiscellaneous === index;
		}
		return false;
	}

	onMount(() => {
		// Dynamic font sizing logic (skip on mobile to prevent glitches)
		function adjustFontSizes() {
			// Skip on mobile devices
			if (window.innerWidth <= 768) return;
			
			const boxes = document.querySelectorAll(`.${faqStyles.box}`);
			boxes.forEach((box) => {
				/** @type {HTMLElement | null} */
				const content = box.querySelector(`.${faqStyles.questionsList}`);
				if (!content) return;

				let fontSize = 16;
				const minFontSize = 12;
				content.style.fontSize = `${fontSize}px`;

				// Check if content overflows
				while (content.scrollHeight > content.clientHeight && fontSize > minFontSize) {
					fontSize -= 0.5;
					content.style.fontSize = `${fontSize}px`;
				}
			});
		}

		// Adjust on mount and window resize
		setTimeout(adjustFontSizes, 100);
		window.addEventListener('resize', adjustFontSizes);
		return () => window.removeEventListener('resize', adjustFontSizes);
	});
</script>

<section id="faq" class={faqStyles.faq}>
	<div class={faqStyles.content}>
		<h2 class={faqStyles.title}>
			<img src="/triangle.svg" alt="" class={faqStyles.triangleIcon} />
			FAQ
		</h2>
		
		<div class={faqStyles.boxesContainer}>
			<!-- General Box -->
			<div class={faqStyles.box}>
				<img src="/box-left.svg" alt="" class={faqStyles.boxBackground} />
				<div class={faqStyles.boxContent}>
					<div class={faqStyles.headingContainer}>
						<img src="/general.svg" alt="GENERAL" class={faqStyles.headingSvg} />
					</div>
					<div class={faqStyles.questionsList}>
						{#each faqData.general as question, index}
							<div class={faqStyles.questionItem}>
								<button
									class={faqStyles.questionButton}
									class:expanded={isExpanded('general', index)}
									on:click={(e) => toggleQuestion('general', index, e)}
									aria-expanded={isExpanded('general', index)}
								>
									<span class={faqStyles.questionText}>{question.question}</span>
								</button>
								<div
									class={faqStyles.answerContainer}
								>
									<p class={faqStyles.answerText}>{question.answer}</p>
								</div>
								{#if index < faqData.general.length - 1}
									<img src="/q-sep.svg" alt="" class={faqStyles.questionSeparator} />
								{/if}
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Separator between boxes -->
			<img src="/seperator.svg" alt="" class={faqStyles.boxSeparator} />

			<!-- Registration Box -->
			<div class={faqStyles.box}>
				<img src="/box-middle.svg" alt="" class={faqStyles.boxBackground} />
				<div class={faqStyles.boxContent}>
					<div class={faqStyles.headingContainer}>
						<img src="/reg.svg" alt="REGISTRATION" class={faqStyles.headingSvg} />
					</div>
					<div class={faqStyles.questionsList}>
						{#each faqData.registration as question, index}
							<div class={faqStyles.questionItem}>
								<button
									class={faqStyles.questionButton}
									class:expanded={isExpanded('registration', index)}
									on:click={(e) => toggleQuestion('registration', index, e)}
									aria-expanded={isExpanded('registration', index)}
								>
									<span class={faqStyles.questionText}>{question.question}</span>
								</button>
								<div
									class={faqStyles.answerContainer}
								>
									<p class={faqStyles.answerText}>{question.answer}</p>
								</div>
								{#if index < faqData.registration.length - 1}
									<img src="/q-sep.svg" alt="" class={faqStyles.questionSeparator} />
								{/if}
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Separator between boxes -->
			<img src="/seperator.svg" alt="" class={faqStyles.boxSeparator} />

			<!-- Miscellaneous Box -->
			<div class={faqStyles.box}>
				<img src="/box-right.svg" alt="" class={faqStyles.boxBackground} />
				<div class={faqStyles.boxContent}>
					<div class={faqStyles.headingContainer}>
						<img src="/misc.svg" alt="MISCELLANEOUS" class={faqStyles.headingSvg} />
					</div>
					<div class={faqStyles.questionsList}>
						{#each faqData.miscellaneous as question, index}
							<div class={faqStyles.questionItem}>
								<button
									class={faqStyles.questionButton}
									class:expanded={isExpanded('miscellaneous', index)}
									on:click={(e) => toggleQuestion('miscellaneous', index, e)}
									aria-expanded={isExpanded('miscellaneous', index)}
								>
									<span class={faqStyles.questionText}>{question.question}</span>
								</button>
								<div
									class={faqStyles.answerContainer}
								>
									<p class={faqStyles.answerText}>{question.answer}</p>
								</div>
								{#if index < faqData.miscellaneous.length - 1}
									<img src="/q-sep.svg" alt="" class={faqStyles.questionSeparator} />
								{/if}
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
